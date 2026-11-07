import { getPayload, type Where } from "payload";
import config from "@payload-config";
import {
  buildPhotoSearchWhere,
  getPhotoSortValue,
  type PhotoSortOrder,
} from "@/lib/photo-query";

interface SchoolPhotoQueryOptions {
  page?: number;
  limit?: number;
  schoolId?: string | number;
  classId?: string | number;
  photoType?: string;
  sortOrder?: PhotoSortOrder;
  search?: string;
  /**
   * "public" (default) only returns photos visible in the public gallery.
   * Admin views must explicitly pass "all" to include pending/hidden photos.
   */
  visibility?: "public" | "all";
}

/**
 * Builds a Payload `where` clause from the school photo filters. Returns
 * `undefined` when no filters are active so the query stays unfiltered.
 */
export function buildSchoolPhotoWhere(
  options: SchoolPhotoQueryOptions
): Where | undefined {
  const filters: Where[] = [];

  if (options.visibility !== "all") {
    filters.push({ visibility: { equals: "public" } });
  }

  if (options.schoolId !== undefined && options.schoolId !== "") {
    filters.push({ "schoolDetails.school": { equals: options.schoolId } });
  }

  if (options.classId !== undefined && options.classId !== "") {
    filters.push({ "schoolDetails.class": { equals: options.classId } });
  }

  if (options.photoType) {
    filters.push({ photoType: { equals: options.photoType } });
  }

  const searchWhere = buildPhotoSearchWhere(options.search ?? "", "name", [
    "studentName",
  ]);
  if (searchWhere) {
    filters.push(searchWhere);
  }

  if (filters.length === 0) return undefined;
  if (filters.length === 1) return filters[0];
  return { and: filters };
}

export const getSchoolPhotos = async (options?: SchoolPhotoQueryOptions) => {
  const payload = await getPayload({ config });
  const where = buildSchoolPhotoWhere(options ?? {});

  const photosData = await payload.find({
    collection: "schoolPhotos",
    // Preserve the original descending-by-name default for callers that do
    // not opt into an explicit sort order (e.g. the public gallery).
    sort: options?.sortOrder
      ? getPhotoSortValue(options.sortOrder, "name")
      : "-name",
    page: options?.page,
    limit: options?.limit,
    depth: 1,
    ...(where ? { where } : {}),
  });
  return photosData;
};

// get school photos by school id
export const getSchoolPhotosBySchoolId = async (
  schoolId: string,
  options?: Omit<SchoolPhotoQueryOptions, "schoolId">
) => {
  return getSchoolPhotos({ ...options, schoolId });
};

// get school photos by class id
export const getSchoolPhotosByClassId = async (
  classId: string,
  options?: Omit<SchoolPhotoQueryOptions, "classId">
) => {
  return getSchoolPhotos({ ...options, classId });
};


export async function getSchoolPhotoById(id: string) {
  const payload = await getPayload({ config });
  const photo = await payload.findByID({
    collection: "schoolPhotos",
    id: id,
    depth: 2,
  });
  return photo;
}
