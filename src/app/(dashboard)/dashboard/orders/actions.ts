"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import { Order } from "@/payload-types"

export async function getFilteredOrdersForPrint(schoolId?: string, classId?: string, paidOnly?: boolean, date?: string): Promise<Order[]> {
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

  if (paidOnly) {
    where["orderStatus"] = {
      in: ["completed", "processing", "printed"],
    }
  }

  if (date !== undefined && date !== null && date !== "") {
    const startOfDay = new Date(`${date}T00:00:00.000`)
    const endOfDay = new Date(`${date}T23:59:59.999`)
    if (!isNaN(startOfDay.getTime()) && !isNaN(endOfDay.getTime())) {
      where["createdAt"] = {
        greater_than_equal: startOfDay.toISOString(),
        less_than_equal: endOfDay.toISOString(),
      }
    }
  }

  const orders = await payload.find({
    collection: "orders",
    depth: 4,
    ...(Object.keys(where).length > 0 ? { where } : {}),
    limit: 1000,
  })

  return orders.docs as unknown as Order[]
}
