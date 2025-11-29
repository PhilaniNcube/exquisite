import { getPayload } from "payload"
import config from "@payload-config"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function ClassDetails({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const payload = await getPayload({ config })
  
  const id = parseInt(classId, 10)
  if (isNaN(id)) {
    notFound()
  }

  try {
    const cls = await payload.findByID({
      collection: "classes",
      id: id,
      depth: 1,
    })

    if (!cls) {
        notFound()
    }

    const schoolName = typeof cls.school === "object" ? cls.school.name : "Unknown School"
    const schoolId = typeof cls.school === "object" ? cls.school.id : cls.school

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {cls.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">School</p>
              <Link href={`/dashboard/schools/${schoolId}`} className="hover:underline text-primary">
                {schoolName}
              </Link>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Class ID</p>
              <p>{cls.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p>{new Date(cls.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("Error fetching class:", error)
    notFound()
  }
}
