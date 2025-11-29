import React, { Suspense } from 'react'
import ClassesTable from '@/components/dashboard/classes/classes-table'
import { Skeleton } from '@/components/ui/skeleton'

export default function ClassesPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Classes</h1>
      <Suspense fallback={<ClassesTableSkeleton />}>
        <ClassesTable />
      </Suspense>
    </div>
  )
}

function ClassesTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
