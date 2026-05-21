import { getPayload } from "payload";
import config from "@payload-config";
import { Order } from "@/payload-types";
import { cacheLife, cacheTag } from "next/cache";

export const getOrders = async (
  page = 1,
  limit = 10,
  schoolId?: string | number,
  classId?: string | number
) => {
  "use cache";
  cacheLife("minutes");
  cacheTag("orders");
  const payload = await getPayload({ config });

  const where: any = {};

  if (schoolId !== undefined && schoolId !== null && schoolId !== "") {
    const numSchoolId = typeof schoolId === "string" ? Number(schoolId) : schoolId;
    if (!isNaN(numSchoolId)) {
      where["productDetails.orderItems.picture.schoolDetails.school"] = {
        equals: numSchoolId,
      };
    }
  }

  if (classId !== undefined && classId !== null && classId !== "") {
    const numClassId = typeof classId === "string" ? Number(classId) : classId;
    if (!isNaN(numClassId)) {
      where["productDetails.orderItems.picture.schoolDetails.class"] = {
        equals: numClassId,
      };
    }
  }

  const orders = await payload.find({
    collection: "orders",
    depth: 4,
    ...(Object.keys(where).length > 0 ? { where } : {}),
    page,
    limit,
  });
  return orders;
};

export const getOrder = async (id: number) => {
  const payload = await getPayload({ config });
  const order = await payload.findByID({
    collection: "orders",
    id,
    depth: 4,
  });
  return order;
};
