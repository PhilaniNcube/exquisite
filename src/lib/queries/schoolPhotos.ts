import { getPayload } from "payload";
import config from "@payload-config";

export const getSchoolPhotos = async (options?: {
  page?: number;
  limit?: number;
}) => {
  const payload = await getPayload({ config });
  const photosData = await payload.find({
    collection: "schoolPhotos",
    sort: "-name",
    ...options,
  });
  return photosData;
};

// get school photos by school id
export const getSchoolPhotosBySchoolId = async (
  schoolId: string,
  options?: {
    page?: number;
    limit?: number;
    classId?: string;
    photoType?: string;
  }
) => {
  const payload = await getPayload({ config });

  const where: any = {
    "schoolDetails.school": {
      equals: schoolId,
    },
  };

  if (options?.classId) {
    where["schoolDetails.class"] = {
      equals: options.classId,
    };
  }

  if (options?.photoType) {
    where.photoType = {
      equals: options.photoType,
    };
  }

  const { page, limit } = options || {};

  const photosData = await payload.find({
    collection: "schoolPhotos",
    where,
    depth: 1,
    sort: "-name",
    page,
    limit,
  });
  return photosData;
};

// get school photos by class id
export const getSchoolPhotosByClassId = async (
  classId: string,
  options?: {
    page?: number;
    limit?: number;
  }
) => {
  const payload = await getPayload({ config });
  const photosData = await payload.find({
    collection: "schoolPhotos",
    where: {
      "schoolDetails.class": {
        equals: classId,
      },
    },
    depth: 1,
    sort: "-name",
    ...options,
  });
  return photosData;
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