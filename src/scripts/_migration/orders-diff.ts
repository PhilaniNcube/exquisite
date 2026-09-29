/**
 * Compare orders between Neon (source) and Turso (target):
 *  - missing: in Neon but not Turso
 *  - changed: in both but with a different updated_at
 *
 * Run: node --env-file=.env.local --import tsx/esm src/scripts/_migration/orders-diff.ts
 */
import { neon } from '@neondatabase/serverless'
import { createClient } from '@libsql/client'

type SourceOrder = { id: number; epoch: number }
type TargetOrder = { id: number; updated_at: string | null }

const main = async () => {
  const neonSql = neon(
    process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || '',
  )
  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL || '',
    authToken: process.env.TURSO_ACCESS_TOKEN,
  })

  const source = (await neonSql.query(
    `select id, extract(epoch from updated_at) * 1000 as epoch from orders order by id`,
    [],
  )) as SourceOrder[]

  const target = (
    await turso.execute('select id, updated_at from orders order by id')
  ).rows as unknown as TargetOrder[]

  const targetById = new Map(target.map((row) => [Number(row.id), row]))

  const missing: number[] = []
  const changed: Array<{ id: number; sourceEpoch: number; targetMs: number }> = []

  for (const row of source) {
    const id = Number(row.id)
    const match = targetById.get(id)
    if (!match) {
      missing.push(id)
      continue
    }
    const targetMs = match.updated_at ? Date.parse(match.updated_at) : NaN
    if (Math.abs(targetMs - Number(row.epoch)) > 1) {
      changed.push({ id, sourceEpoch: Number(row.epoch), targetMs })
    }
  }

  const sourceIds = new Set(source.map((row) => Number(row.id)))
  const extra = target
    .map((row) => Number(row.id))
    .filter((id) => !sourceIds.has(id))

  console.log(`Neon orders:  ${source.length}`)
  console.log(`Turso orders: ${target.length}`)
  console.log(`Missing in Turso: [${missing.join(', ')}]`)
  console.log(`Extra in Turso:   [${extra.join(', ')}]`)
  console.log(
    `Updated since migration (${changed.length}): ${changed
      .map((c) => `${c.id} (neon ${new Date(c.sourceEpoch).toISOString()} vs turso ${
        Number.isNaN(c.targetMs) ? 'n/a' : new Date(c.targetMs).toISOString()
      })`)
      .join('; ') || '(none)'}`,
  )

  // Ensure the missing orders only reference documents that exist in Turso.
  if (missing.length) {
    const idList = missing.join(',')
    const customers = (
      await neonSql.query(
        `select distinct customer_details_customer_id as id from orders
          where id in (${idList}) and customer_details_customer_id is not null`,
        [],
      )
    ).map((row) => Number(row.id))

    const items = (await neonSql.query(
      `select distinct product_id, picture_id from orders_product_details_order_items
        where _parent_id in (${idList})`,
      [],
    )) as Array<{ product_id: number | null; picture_id: number | null }>

    const productIds = [...new Set(items.map((i) => i.product_id).filter(Boolean))] as number[]
    const pictureIds = [...new Set(items.map((i) => i.picture_id).filter(Boolean))] as number[]

    const missingIds = async (table: string, ids: number[]) => {
      if (!ids.length) return []
      const rows = (
        await turso.execute({
          sql: `select id from "${table}" where id in (${ids.map(() => '?').join(',')})`,
          args: ids,
        })
      ).rows.map((row) => Number(row.id))
      const present = new Set(rows)
      return ids.filter((id) => !present.has(id))
    }

    const deps = [
      { table: 'customers', ids: await missingIds('customers', customers) },
      { table: 'products', ids: await missingIds('products', productIds) },
      { table: 'school_photos', ids: await missingIds('school_photos', pictureIds) },
    ].filter((dep) => dep.ids.length)

    console.log(
      deps.length
        ? `Missing dependencies in Turso: ${deps.map((d) => `${d.table}[${d.ids.join(',')}]`).join(', ')}`
        : 'All dependencies of the missing orders already exist in Turso.',
    )
  }

  turso.close()
  return
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
