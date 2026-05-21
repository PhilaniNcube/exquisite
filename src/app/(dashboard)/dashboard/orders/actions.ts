"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import { Order } from "@/payload-types"

export async function getFilteredOrdersForPrint(schoolId?: string, classId?: string): Promise<Order[]> {
  const payload = await getPayload({ config })
  const where: any = {}

  if (schoolId && schoolId !== "all") {
    const numSchoolId = Number(schoolId)
    if (!isNaN(numSchoolId)) {
      where["productDetails.orderItems.picture.schoolDetails.school"] = {
        equals: numSchoolId,
      }
    }
  }

  if (classId && classId !== "all") {
    const numClassId = Number(classId)
    if (!isNaN(numClassId)) {
      where["productDetails.orderItems.picture.schoolDetails.class"] = {
        equals: numClassId,
      }
    }
  }

  const orders = await payload.find({
    collection: "orders",
    depth: 4,
    ...(Object.keys(where).length > 0 ? { where } : {}),
    limit: 1000,
  })

  // We return the docs directly
  return orders.docs as unknown as Order[]
}
