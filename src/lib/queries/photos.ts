import { getPayload, type Where } from "payload";
import config from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import {
  buildPhotoSearchWhere,
  getPhotoSortValue,
  type PhotoSortOrder,
} from "@/lib/photo-query";



export const getCategoryPhotos = async (
  categoryId: number,
  sortOrder: PhotoSortOrder = "asc",
  search = ""
) => {
  "use cache";
  cacheTag(`category-photos-${categoryId}`);
  cacheLife("hours")
  const payload = await getPayload({ config });
  const searchWhere = buildPhotoSearchWhere(search, "title");
  const where: Where = searchWhere
    ? { and: [{ category: { equals: categoryId } }, searchWhere] }
    : { category: { equals: categoryId } };

  const photos = await payload.find({
    collection: "photos",
    where,
    sort: getPhotoSortValue(sortOrder, "title"),
    limit: 100,
  });
  return photos;
};


export const getCategoryPhotosBySlug = async (slug: string) => {
  "use cache";
  cacheTag(`category-photos-${slug}`);
  cacheLife("hours")
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
    limit: 100,
  });
  return photos;
};


export const getPhotoById = async (id: number) => {
  "use cache";
  cacheTag(`photo-${id}`);
  cacheLife("hours");
  const payload = await getPayload({ config });
  const photo = await payload.findByID({
    collection: "photos",
    id,
  });
  return photo;
};

export const getPhotos = async (
  page: number = 1,
  limit: number = 12,
  sortOrder: PhotoSortOrder = "asc",
  search = ""
) => {
  "use cache";
  cacheTag(`photos-page-${page}`);
  cacheLife("hours");
  const payload = await getPayload({ config });
  const searchWhere = buildPhotoSearchWhere(search, "title");
  const photos = await payload.find({
    collection: "photos",
    limit,
    page,
    depth: 1,
    sort: getPhotoSortValue(sortOrder, "title"),
    ...(searchWhere ? { where: searchWhere } : {}),
  });
  return photos;
};
