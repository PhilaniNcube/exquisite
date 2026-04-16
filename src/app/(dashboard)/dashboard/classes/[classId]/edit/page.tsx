import { Suspense } from "react"
import { getPayload } from "payload"
import config from "@payload-config"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EditClassForm } from "@/components/dashboard/classes/edit-class-form"

export default function EditClassPage({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  return (
    <div className="container mx-auto py-10 space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/classes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit Class</h1>
      </div>

      <Suspense fallback={<EditClassSkeleton />}>
        <EditClassContent params={params} />
      </Suspense>
    </div>
  )
}

async function EditClassContent({
  params,
}: {
  params: Promise<{ classId: string }>
}) {
  const { classId } = await params
  const id = parseInt(classId, 10)
  if (isNaN(id)) {
    notFound()
  }

  const payload = await getPayload({ config })

  let cls
  try {
    cls = await payload.findByID({
      collection: "classes",
      id,
      depth: 1,
    })
  } catch {
    notFound()
  }

  if (!cls) {
    notFound()
  }

  const schoolName = typeof cls.school === "object" ? cls.school.name : "Unknown School"

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Class Details
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({schoolName})
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditClassForm cls={cls} />
      </CardContent>
    </Card>
  )
}

function EditClassSkeleton() {
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
        <Skeleton className="h-10 w-32" />
      </CardContent>
    </Card>
  )
}
