import { getPayload } from "payload";
import config from "@payload-config";

export const getSchoolPhotos = async (options?: {
  page?: number;
  limit?: number;
}) => {
  const payload = await getPayload({ config });
  const photosData = await payload.find({
    collection: "schoolPhotos",
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
  }
) => {
  const payload = await getPayload({ config });
  const photosData = await payload.find({
    collection: "schoolPhotos",
    where: {
      "schoolDetails.school": {
        equals: schoolId,
      },
    },
    depth: 1,
    ...options,
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
    ...options,
  });
  return photosData;
};
