import { getPayload } from "payload"
import config from "@payload-config"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function SchoolDetails({
  params,
}: {
  params: Promise<{ schoolId: string }>
}) {
  const { schoolId } = await params
  const payload = await getPayload({ config })
  
  // Check if schoolId is a valid number since School ID is a number
  const id = parseInt(schoolId, 10)
  if (isNaN(id)) {
    notFound()
  }

  try {
    const school = await payload.findByID({
      collection: "schools",
      id: id,
    })

    if (!school) {
        notFound()
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {school.name}
            <Badge variant="outline" className="capitalize">
              {school.type}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Pass Code</p>
              <p>{school.pass_code || "None"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">School ID</p>
              <p>{school.id}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Created At</p>
              <p>{new Date(school.createdAt).toLocaleDateString()}</p>
            </div>
             <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
              <p>{new Date(school.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  } catch (error) {
    console.error("Error fetching school:", error)
    notFound()
  }
}
