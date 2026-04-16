import { Suspense } from "react"
import { getPayload } from "payload"
import config from "@payload-config"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EditSchoolForm } from "@/components/dashboard/schools/edit-school-form"

export default function EditSchoolPage({
  params,
}: {
  params: Promise<{ schoolId: string }>
}) {
  return (
    <div className="container mx-auto py-10 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/schools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit School</h1>
      </div>

      <Suspense fallback={<EditSchoolSkeleton />}>
        <EditSchoolContent params={params} />
      </Suspense>
    </div>
  )
}

async function EditSchoolContent({
  params,
}: {
  params: Promise<{ schoolId: string }>
}) {
  const { schoolId } = await params
  const id = parseInt(schoolId, 10)
  if (isNaN(id)) {
    notFound()
  }

  const payload = await getPayload({ config })

  let school
  try {
    school = await payload.findByID({
      collection: "schools",
      id,
    })
  } catch {
    notFound()
  }

  if (!school) {
    notFound()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>School Details</CardTitle>
      </CardHeader>
      <CardContent>
        <EditSchoolForm school={school} />
      </CardContent>
    </Card>
  )
}

function EditSchoolSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-7 w-1/3" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  )
}
