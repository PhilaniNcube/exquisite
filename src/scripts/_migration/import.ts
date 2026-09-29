/**
 * Import the data exported by `export.ts` into the Turso (libSQL) database.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx/esm src/scripts/_migration/import.ts
 *
 * Options:
 *   --only=<slug>       Only import a single collection (useful for testing).
 *   --limit=<n>         Only import the first n docs of each collection (testing).
 *   --fresh             Delete existing target docs for each collection first.
 *   MIGRATION_CONCURRENCY  Number of concurrent writes (default 1).
 *
 * The collection order below satisfies foreign keys (referenced collections
 * first). IDs are preserved (allowIDOnCreate), so relationships, uploaded file
 * URLs and auth credentials keep working exactly as before.
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildPayloadConfig } from '../../payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(dirname, 'data')

// Migration bookkeeping is per-database and must not be copied across.
const SKIP = new Set(['payload-migrations'])

// Referenced collections first.
const ORDER = [
  'media',
  'categories',
  'schools',
  'classes',
  'products',
  'schoolPhotos',
  'customers',
  'users',
  'client-galleries',
  'photos',
  'orders',
  'payload-preferences',
  'payload-kv',
  'payload-locked-documents',
]

const onlyArg = process.argv.find((arg) => arg.startsWith('--only='))
const only = onlyArg ? onlyArg.split('=')[1] : null
const limitArg = process.argv.find((arg) => arg.startsWith('--limit='))
const limit = limitArg ? Number(limitArg.split('=')[1]) : 0
const fresh = process.argv.includes('--fresh')
const concurrency = Math.max(1, Number(process.env.MIGRATION_CONCURRENCY || 1))

const readJson = async <T,>(file: string): Promise<T | null> => {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8')) as T
  } catch {
    return null
  }
}

const main = async () => {
  const config = buildPayloadConfig(
    sqliteAdapter({
      client: {
        url: process.env.TURSO_DATABASE_URL || '',
        authToken: process.env.TURSO_ACCESS_TOKEN,
      },
      migrationDir: path.resolve(dirname, '../../migrations-sqlite'),
      // We manage the schema with migrations, so disable Drizzle's dev "push".
      push: false,
      // Preserve the original primary keys.
      allowIDOnCreate: true,
    }),
  )

  const payload = await getPayload({ config })

  const manifest = await readJson<Record<string, number>>(
    path.join(dataDir, 'manifest.json'),
  )
  const slugs = manifest ? Object.keys(manifest) : []

  const ordered = [
    ...ORDER.filter((slug) => slugs.includes(slug)),
    ...slugs.filter((slug) => !ORDER.includes(slug)),
  ].filter((slug) => !SKIP.has(slug))

  const targets = only ? ordered.filter((slug) => slug === only) : ordered

  for (const slug of targets) {
    const allDocs = await readJson<Record<string, unknown>[]>(
      path.join(dataDir, `${slug}.json`),
    )
    if (!allDocs) {
      console.log(`skipping ${slug}: no export file`)
      continue
    }
    const docs = limit > 0 ? allDocs.slice(0, limit) : allDocs

    if (fresh) {
      await payload.db.deleteMany({ collection: slug as never, where: {} })
    }

    let done = 0
    let failed = 0
    const queue = [...docs]

    const worker = async () => {
      while (queue.length) {
        const doc = queue.shift()!
        try {
          await payload.db.create({
            collection: slug as never,
            data: doc as never,
            returning: false,
          } as never)
        } catch (error) {
          failed++
          console.error(
            `FAILED ${slug} id=${String(doc.id)}: ${(error as Error).message}`,
          )
        }
        done++
        if (done % 500 === 0) console.log(`${slug}: ${done}/${docs.length}`)
      }
    }

    await Promise.all(
      Array.from({ length: Math.min(concurrency, docs.length || 1) }, worker),
    )

    console.log(`${slug}: imported ${done - failed}/${docs.length} (${failed} failed)`)
  }

  console.log('Import complete.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
