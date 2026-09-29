/**
 * Bulk-load a local SQLite file (produced by `payload migrate` + `import.ts`
 * against a `file:` database) into Turso.
 *
 * Usage:
 *   node --env-file=.env.local --import tsx/esm src/scripts/_migration/sync.ts
 *
 * Why: writing row-by-row to Turso is bound by its single-writer latency
 * (~6 docs/s). Importing into a local file first and then sending batched
 * INSERTs makes the network transfer manageable.
 *
 * Tables are written parent-first (derived from `PRAGMA foreign_key_list`) so
 * foreign keys stay satisfied, and existing rows are cleared child-first.
 * `payload_migrations` is never copied - it belongs to the target database.
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@libsql/client'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const localPath = process.env.MIGRATION_LOCAL_DB || path.join(dirname, '.local.db')
const remoteUrl = process.env.TURSO_DATABASE_URL || ''
const authToken = process.env.TURSO_ACCESS_TOKEN

const SKIP_TABLES = new Set(['payload_migrations'])
const BATCH_SIZE = 100

type Row = Record<string, unknown>

const normalize = (value: unknown): unknown => {
  if (value === undefined) return null
  if (typeof value === 'boolean') return value ? 1 : 0
  return value
}

const tableOrder = async (local: ReturnType<typeof createClient>) => {
  const master = await local.execute(
    `select name from sqlite_master where type = 'table' and name not like 'sqlite_%'`,
  )
  const tables = master.rows
    .map((row) => String(row.name))
    .filter((name) => !SKIP_TABLES.has(name))

  const deps = new Map<string, Set<string>>()
  for (const table of tables) {
    const fks = await local.execute(`PRAGMA foreign_key_list("${table}")`)
    const parents = new Set<string>()
    for (const fk of fks.rows) {
      const parent = String(fk.table)
      if (parent !== table && tables.includes(parent)) parents.add(parent)
    }
    deps.set(table, parents)
  }

  const order: string[] = []
  const state = new Map<string, number>() // 1 = visiting, 2 = done
  const visit = (table: string) => {
    const current = state.get(table) || 0
    if (current !== 0) return
    state.set(table, 1)
    for (const parent of deps.get(table) || []) visit(parent)
    state.set(table, 2)
    order.push(table)
  }
  tables.forEach(visit)

  return order
}

const main = async () => {
  if (!remoteUrl) throw new Error('TURSO_DATABASE_URL is not set')
  await fs.access(localPath)

  const local = createClient({ url: `file:${localPath}` })
  const remote = createClient({ url: remoteUrl, authToken })

  const order = await tableOrder(local)
  console.log(`tables (parent-first): ${order.join(', ')}`)

  // Clear target, children first, so re-runs are safe.
  for (const table of [...order].reverse()) {
    await remote.execute(`DELETE FROM "${table}"`)
  }
  console.log('cleared target tables')

  let total = 0
  for (const table of order) {
    const result = await local.execute(`select * from "${table}"`)
    const rows = result.rows as unknown as Row[]
    if (!rows.length) {
      console.log(`${table}: 0`)
      continue
    }

    const columns = result.columns
    const columnList = columns.map((column) => `"${column}"`).join(', ')
    const placeholders = columns.map(() => '?').join(', ')
    const sql = `INSERT INTO "${table}" (${columnList}) VALUES (${placeholders})`

    const statements = rows.map((row) => ({
      sql,
      args: columns.map((column) => normalize(row[column])),
    }))

    for (let i = 0; i < statements.length; i += BATCH_SIZE) {
      await remote.batch(statements.slice(i, i + BATCH_SIZE) as never, 'write')
    }

    total += rows.length
    console.log(`${table}: ${rows.length}`)
  }

  console.log(`Synced ${total} rows to Turso.`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
