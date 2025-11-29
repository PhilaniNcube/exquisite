'use server'

import { getPayload } from "payload"
import config from "@payload-config"
import { revalidatePath } from "next/cache"

export async function deleteClass(classId: number, schoolId: number) {
  try {
    const payload = await getPayload({ config })
    await payload.delete({
      collection: "classes",
      id: classId,
    })
    revalidatePath(`/dashboard/schools/${schoolId}`)
    return { success: true, message: "Class deleted successfully" }
  } catch (error) {
    console.error("Error deleting class:", error)
    return { success: false, message: "Failed to delete class" }
  }
}
