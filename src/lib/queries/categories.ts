import { getPayload } from 'payload'
import config from '@payload-config'

export const getCategories = async () => {
  "use cache"
  const payload = await getPayload({ config })
  const categories = await payload.find({
    collection: 'categories',
    limit: 50,
    sort: '-createdAt',
  })
  return categories
}

export const getCategoryBySlug = async (slug: string) => {
  "use cache"
  const payload = await getPayload({ config })
  const category = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
  })
  return category
}