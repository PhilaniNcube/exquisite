import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

export const getCategories = async () => {
  const categories = await payload.find({
    collection: 'categories',
    limit: 50,
    sort: '-createdAt',
  })
  return categories
}

export const getCategoryBySlug = async (slug: string) => {
  const category = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
  })
  return category
}