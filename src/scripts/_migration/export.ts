/**
 * Export all Payload documents from the legacy Postgres (Neon) database.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx/esm src/scripts/_migration/export.ts
 *
 * Writes one JSON file per collection to `src/scripts/_migration/data`.
 * Documents are read at `depth: 0` (relationships as IDs) with hidden fields
 * (e.g. auth `hash`/`salt`) included, so they can be re-imported faithfully.
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildPayloadConfig } from '../../payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(dirname, 'data')

// Migration bookkeeping is per-database and must not be copied across.
const SKIP = new Set(['payload-migrations'])

const postgresConnectionString = () => {
  let url = process.env.DATABASE_URI || process.env.DATABASE_URL || ''
  if (url) {
    // Upgrade warning-triggering SSL modes to verify-full to maintain secure behavior
    url = url
      .replace('sslmode=require', 'sslmode=verify-full')
      .replace('sslmode=prefer', 'sslmode=verify-full')
      .replace('sslmode=verify-ca', 'sslmode=verify-full')
  }
  return url
}

/**
 * Upload `url` fields are derived at read time from `filename` + `serverURL`.
 * `payload.find` resolves them to absolute URLs, so strip the serverURL prefix
 * to recover the relative value that is actually persisted in the database.
 * Otherwise the dummy/local `serverURL` used during migration would be treated
 * as an "external" URL and leak into the new database.
 */
const toStoredURL = (value: unknown, serverURL: string) => {
  if (typeof value !== 'string') return value
  if (serverURL && value.startsWith(serverURL)) {
    return value.slice(serverURL.length) || '/'
  }
  return value
}

const normalizeUploadURLs = (doc: Record<string, any>, serverURL: string) => {
  doc.url = toStoredURL(doc.url, serverURL)
  doc.thumbnailURL = toStoredURL(doc.thumbnailURL, serverURL)
  if (doc.sizes && typeof doc.sizes === 'object') {
    for (const size of Object.values<any>(doc.sizes)) {
      if (size && typeof size === 'object') {
        size.url = toStoredURL(size.url, serverURL)
      }
    }
  }
  return doc
}

const main = async () => {
  const config = buildPayloadConfig(
    postgresAdapter({
      pool: { connectionString: postgresConnectionString() },
      migrationDir: path.resolve(dirname, '../../migrations'),
    }),
  )

  const payload = await getPayload({ config })
  const serverURL = payload.config.serverURL || ''
  await fs.mkdir(dataDir, { recursive: true })

  const manifest: Record<string, number> = {}

  for (const collection of payload.config.collections) {
    const slug = collection.slug
    if (SKIP.has(slug)) continue

    const result = await payload.find({
      collection: slug as never,
      depth: 0,
      limit: 0,
      pagination: false,
      showHiddenFields: true,
      overrideAccess: true,
    })

    const docs = collection.upload
      ? result.docs.map((doc) => normalizeUploadURLs(doc as Record<string, any>, serverURL))
      : result.docs

    await fs.writeFile(
      path.join(dataDir, `${slug}.json`),
      JSON.stringify(docs),
    )
    manifest[slug] = docs.length
    console.log(`exported ${slug}: ${docs.length}`)
  }

  await fs.writeFile(
    path.join(dataDir, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
  )
  console.log('Export complete.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
