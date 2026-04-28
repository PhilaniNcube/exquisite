'use server'

import { getPayload } from "payload"
import config from "@payload-config"
import { revalidatePath } from "next/cache"
import { headers as getHeaders } from "next/headers"

export async function deleteSchool(schoolId: number) {
  try {
    const payload = await getPayload({ config })
    const headers = await getHeaders()
    const result = await payload.auth({ headers, canSetHeaders: false })

    const isAdmin =
      result.user?.collection === "users" &&
      result.user.roles?.includes("admin")

    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      }
    }

    // 1. Find all classes belonging to this school
    const classes = await payload.find({
      collection: "classes",
      where: { school: { equals: schoolId } },
      limit: 1000,
    })

    const classIds = classes.docs.map((cls) => cls.id)

    // 2. Delete all school photos linked to this school (by school relationship)
    //    This covers photos linked directly to the school, regardless of class
    await payload.delete({
      collection: "schoolPhotos",
      where: {
        "schoolDetails.school": { equals: schoolId },
      },
    })

    // 3. Delete all classes belonging to this school
    if (classIds.length > 0) {
      await payload.delete({
        collection: "classes",
        where: {
          school: { equals: schoolId },
        },
      })
    }

    // 4. Delete the school itself
    await payload.delete({
      collection: "schools",
      id: schoolId,
    })

    revalidatePath("/dashboard/schools")
    revalidatePath("/dashboard/classes")

    return {
      success: true,
      message: `School and ${classes.docs.length} class(es) deleted successfully`,
    }
  } catch (error) {
    console.error("Error deleting school:", error)
    return {
      success: false,
      message: "Failed to delete school. It may have orders referencing its photos.",
    }
  }
}
