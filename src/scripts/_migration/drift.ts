/**
 * Compare row counts for every collection between Neon (source) and Turso
 * (target). Any non-zero delta means data was written to Neon after the
 * migration snapshot and would be lost once the app switches to Turso.
 *
 * Run: node --env-file=.env.local --import tsx/esm src/scripts/_migration/drift.ts
 */
import { neon } from '@neondatabase/serverless'
import { createClient } from '@libsql/client'

const TABLES = [
  'users',
  'media',
  'categories',
  'photos',
  'customers',
  'client_galleries',
  'schools',
  'classes',
  'products',
  'school_photos',
  'orders',
  'orders_product_details_order_items',
  'payload_preferences',
  'payload_kv',
  'payload_locked_documents',
]

const main = async () => {
  const neonSql = neon(
    process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || '',
  )
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_ACCESS_TOKEN,
  })

  let drifted = 0
  console.log('table'.padEnd(38), 'neon'.padStart(8), 'turso'.padStart(8), 'delta'.padStart(8))
  for (const table of TABLES) {
    const source = (await neonSql.query(
      `select count(*)::int as n from "${table}"`,
      [],
    )) as Array<{ n: number }>
    const target = (await turso.execute(`select count(*) as n from "${table}"`)).rows
    const sourceCount = Number(source[0]?.n ?? 0)
    const targetCount = Number(target[0]?.n ?? 0)
    const delta = sourceCount - targetCount
    if (delta !== 0) drifted++
    console.log(
      table.padEnd(38),
      String(sourceCount).padStart(8),
      String(targetCount).padStart(8),
      String(delta).padStart(8),
    )
  }

  console.log(
    drifted === 0
      ? '\nNo drift - Turso matches Neon for all checked collections.'
      : `\n${drifted} table(s) drifted.`,
  )
  process.exit(drifted === 0 ? 0 : 2)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
