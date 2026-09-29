/**
 * Incrementally sync orders from Neon (source) to Turso (target).
 *
 * By default it detects orders present in Neon but missing from Turso and
 * copies only those. Pass explicit ids to force a specific set:
 *   node --env-file=.env.local --import tsx/esm src/scripts/_migration/sync-orders.ts --ids=1949,1950
 *
 * Unlike `sync.ts`, this does not clear any tables - it only inserts missing
 * orders (preserving ids) and skips ones that already exist.
 */
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { buildPayloadConfig } from '../../payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const postgresConnectionString = () => {
  let url = process.env.DATABASE_URI || process.env.DATABASE_URL || ''
  url = url
    .replace('sslmode=require', 'sslmode=verify-full')
    .replace('sslmode=prefer', 'sslmode=verify-full')
    .replace('sslmode=verify-ca', 'sslmode=verify-full')
  return url
}

const idsArg = process.argv.find((arg) => arg.startsWith('--ids='))
const explicitIds = idsArg
  ? idsArg
      .split('=')[1]
      .split(',')
      .map((value) => Number(value.trim()))
      .filter((value) => Number.isFinite(value))
  : []

const main = async () => {
  const source = await getPayload({
    config: buildPayloadConfig(
      postgresAdapter({
        pool: { connectionString: postgresConnectionString() },
        migrationDir: path.resolve(dirname, '../../migrations'),
      }),
    ),
    // Distinct cache keys so two adapters can coexist in one process.
    key: 'migration-source-postgres',
  })

  const target = await getPayload({
    config: buildPayloadConfig(
      sqliteAdapter({
        client: {
          url: process.env.TURSO_DATABASE_URL || '',
          authToken: process.env.TURSO_ACCESS_TOKEN,
        },
        migrationDir: path.resolve(dirname, '../../migrations-sqlite'),
        push: false,
        allowIDOnCreate: true,
      }),
    ),
    key: 'migration-target-sqlite',
  })

  // Determine which orders need copying.
  let ids = explicitIds
  if (!ids.length) {
    const [sourceOrders, targetOrders] = await Promise.all([
      source.find({ collection: 'orders', depth: 0, pagination: false, limit: 0 }),
      target.find({ collection: 'orders', depth: 0, pagination: false, limit: 0 }),
    ])
    const targetIds = new Set(targetOrders.docs.map((doc) => doc.id))
    ids = sourceOrders.docs
      .map((doc) => doc.id)
      .filter((id) => !targetIds.has(id)) as number[]
  }

  console.log(`Neon total: ${(await source.find({ collection: 'orders', depth: 0, limit: 1 })).totalDocs}`)
  console.log(`Orders to sync: [${ids.join(', ')}]`)

  if (!ids.length) {
    console.log('Nothing to do - Turso is already up to date.')
    process.exit(0)
  }

  // Skip any that already exist.
  const existing = await target.find({
    collection: 'orders',
    where: { id: { in: ids } },
    depth: 0,
    pagination: false,
    limit: 0,
  })
  const existingIds = new Set(existing.docs.map((doc) => doc.id))
  const toCreate = ids.filter((id) => !existingIds.has(id))

  const result = await source.find({
    collection: 'orders',
    where: { id: { in: toCreate } },
    depth: 0,
    showHiddenFields: true,
    pagination: false,
    limit: 0,
  })

  for (const doc of result.docs) {
    await target.db.create({
      collection: 'orders',
      data: doc as never,
      returning: false,
    } as never)
    console.log(`synced order ${doc.id}`)
  }

  const after = await target.count({ collection: 'orders' })
  console.log(`Turso orders: ${after.totalDocs}`)
  console.log('Done.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
