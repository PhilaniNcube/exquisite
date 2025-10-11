import { getPayload } from "payload";
import config from "@payload-config";

export const getClasses = async (options?: {
  page?: number;
  limit?: number;
}) => {
  const payload = await getPayload({ config });
  const classes = await payload.find({
    collection: "classes",
    ...options,
  });
  return classes;
};

// get class by id
export const getClassById = async (id: string) => {
  const payload = await getPayload({ config });
  const classItem = await payload.findByID({
    collection: "classes",
    id: id,
  });
  return classItem;
};

// get classes by school id
export const getClassesBySchoolId = async (schoolId: string, options?: {
  page?: number;
  limit?: number;
}) => {
  const payload = await getPayload({ config });
  const classes = await payload.find({
    collection: "classes",
    where: {
      school: {
        equals: schoolId,
      },
    },
    ...options,
  });
  return classes;
};
