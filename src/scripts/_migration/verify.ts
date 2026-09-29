/**
 * Verify the Turso import against the exported JSON snapshot.
 * Run: node --env-file=.env.local --import tsx/esm src/scripts/_migration/verify.ts
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'
import config from '../../payload.config'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(dirname, 'data')

let failures = 0
const check = (label: string, ok: boolean, detail = '') => {
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? ` — ${detail}` : ''}`)
}

const main = async () => {
  const payload = await getPayload({ config })
  const manifest = JSON.parse(
    await fs.readFile(path.join(dataDir, 'manifest.json'), 'utf8'),
  ) as Record<string, number>

  // 1. Row counts match the snapshot.
  for (const [slug, expected] of Object.entries(manifest)) {
    const { totalDocs } = await payload.count({ collection: slug as never })
    check(`count ${slug}`, totalDocs === expected, `expected ${expected}, got ${totalDocs}`)
  }

  // 2. Auth credentials (hash + salt) transferred exactly.
  const exportedUsers = JSON.parse(
    await fs.readFile(path.join(dataDir, 'users.json'), 'utf8'),
  ) as Array<Record<string, unknown>>
  const targetUsers = await payload.find({
    collection: 'users',
    showHiddenFields: true,
    overrideAccess: true,
    limit: 100,
  })
  for (const source of exportedUsers) {
    const target = targetUsers.docs.find((doc) => doc.id === source.id)
    check(
      `user ${source.id} hash/salt`,
      Boolean(target) && target?.hash === source.hash && target?.salt === source.salt,
    )
    check(
      `user ${source.id} roles`,
      JSON.stringify(target?.roles) === JSON.stringify(source.roles),
      `source ${JSON.stringify(source.roles)} target ${JSON.stringify(target?.roles)}`,
    )
  }

  // 3. Upload URLs resolve (rebuilt from filename + serverURL).
  const media = await payload.find({ collection: 'media', limit: 1 })
  const mediaDoc = media.docs[0]
  const expectedMediaUrl = `${payload.config.serverURL}/api/media/file/${encodeURIComponent(String(mediaDoc?.filename))}`
  check(
    'media url resolves from filename',
    mediaDoc?.url === expectedMediaUrl,
    `${mediaDoc?.url} (expected ${expectedMediaUrl})`,
  )
  check('media has filename', Boolean(mediaDoc?.filename), String(mediaDoc?.filename))
  check(
    'media thumbnail size url resolves',
    Boolean(mediaDoc?.sizes?.thumbnail?.url),
    String(mediaDoc?.sizes?.thumbnail?.url),
  )

  // 4. Relationships resolve (photos -> category, image; orders -> items).
  const photo = await payload.find({ collection: 'photos', limit: 1, depth: 1 })
  const p = photo.docs[0]
  check(
    'photo.category populated',
    Boolean(p?.category && typeof p.category === 'object'),
    typeof p?.category,
  )
  check(
    'photo.image populated',
    Boolean(p?.image && typeof p.image === 'object'),
    typeof p?.image,
  )

  const order = await payload.find({ collection: 'orders', limit: 1, depth: 1 })
  const o = order.docs[0]
  const items = (o as never as { productDetails: { orderItems: unknown[] } })?.productDetails?.orderItems
  check('order has items', Array.isArray(items) && items.length > 0, `items: ${items?.length}`)
  const firstItem = items?.[0] as { product?: unknown; picture?: unknown } | undefined
  check(
    'order item.product populated',
    Boolean(firstItem?.product && typeof firstItem.product === 'object'),
  )
  check(
    'order item.picture populated',
    Boolean(firstItem?.picture && typeof firstItem.picture === 'object'),
  )

  // 5. schoolPhotos group relationships resolve.
  const schoolPhoto = await payload.find({ collection: 'schoolPhotos', limit: 1, depth: 1 })
  const sp = schoolPhoto.docs[0] as never as {
    schoolDetails?: { school?: unknown; class?: unknown }
    photo?: unknown
  }
  check('schoolPhoto.photo populated', Boolean(sp?.photo && typeof sp.photo === 'object'))
  if (sp?.schoolDetails?.school) {
    check(
      'schoolPhoto.school populated',
      typeof sp.schoolDetails.school === 'object',
    )
  }

  console.log(failures === 0 ? '\nALL CHECKS PASSED' : `\n${failures} CHECK(S) FAILED`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
