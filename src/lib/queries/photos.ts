import { getPayload } from "payload";
import config from "@payload-config";



export const getCategoryPhotos = async (categoryId: number) => {
  const payload = await getPayload({ config });
  const photos = await payload.find({
    collection: "photos",
    where: { category: { equals: categoryId } },
  });
  return photos;
};


export const getCategoryPhotosBySlug = async (slug: string) => {
  const payload = await getPayload({ config });
  const category = await payload.find({
    collection: "categories",
    where: { slug: { equals: slug } },
    limit: 1,
  });
  
  if (!category.docs.length) {
    return { docs: [], totalDocs: 0, limit: 0, totalPages: 0, page: 1, pagingCounter: 1, hasPrevPage: false, hasNextPage: false };
  }
  
  const photos = await payload.find({
    collection: "photos",
    where: { category: { equals: category.docs[0].id } },
  });
  return photos;
};


export const getPhotoById = async (id: number) => {
  const payload = await getPayload({ config });
  const photo = await payload.findByID({
    collection: "photos",
    id,
  });
  return photo;
};
