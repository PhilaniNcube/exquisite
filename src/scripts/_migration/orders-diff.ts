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

  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
