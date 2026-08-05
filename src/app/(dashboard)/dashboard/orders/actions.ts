"use server"

import { getPayload } from "payload"
import config from "@payload-config"
import { Order } from "@/payload-types"

export async function getFilteredOrdersForPrint(schoolId?: string, classId?: string, paidOnly?: boolean, fromDate?: string, toDate?: string): Promise<Order[]> {
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

  if (fromDate || toDate) {
    const dateQuery: any = {}
    if (fromDate) {
      const startOfDay = new Date(`${fromDate}T00:00:00.000`)
      if (!isNaN(startOfDay.getTime())) {
        dateQuery.greater_than_equal = startOfDay.toISOString()
      }
    }
    if (toDate) {
      const endOfDay = new Date(`${toDate}T23:59:59.999`)
      if (!isNaN(endOfDay.getTime())) {
        dateQuery.less_than_equal = endOfDay.toISOString()
      }
    }
    if (Object.keys(dateQuery).length > 0) {
      where["createdAt"] = dateQuery
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
