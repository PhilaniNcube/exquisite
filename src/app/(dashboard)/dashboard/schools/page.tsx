import React, { Suspense } from 'react'
import SchoolsTable from '@/components/dashboard/schools/schools-table'
import { Skeleton } from '@/components/ui/skeleton'

export default function SchoolsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Schools</h1>
      <Suspense fallback={<SchoolsTableSkeleton />}>
        <SchoolsTable />
      </Suspense>
    </div>
  )
}

function SchoolsTableSkeleton() {
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
