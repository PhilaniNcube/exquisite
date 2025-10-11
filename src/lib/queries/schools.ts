import { getPayload } from "payload";
import config from "@payload-config";

export const getSchools = async (options?: {
  page?: number;
  limit?: number;
}) => {
  const payload = await getPayload({ config });

  const schools = await payload.find({
    collection: "schools",
    ...options,
  });

  return schools;
};

export const getSchoolsWithClasses = async (options?: {
  page?: number;
  limit?: number;
}) => {
  const payload = await getPayload({ config });

  const schools = await payload.find({
    collection: "schools",
    ...options,
  });

  // Fetch classes for each school
  const schoolsWithClasses = await Promise.all(
    schools.docs.map(async (school) => {
      const classes = await payload.find({
        collection: "classes",
        where: {
          school: {
            equals: school.id,
          },
        },
      });
      return {
        ...school,
        classes: classes.docs,
      };
    })
  );

  return {
    ...schools,
    docs: schoolsWithClasses,
  };
};
