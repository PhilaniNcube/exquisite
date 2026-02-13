import React, { Suspense } from 'react'
import SchoolsTable from '@/components/dashboard/schools/schools-table'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function SchoolsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Schools</h1>
        <Button asChild>
          <Link href="/dashboard/schools/add">
            <Plus className="mr-2 h-4 w-4" />
            Add School
          </Link>
        </Button>
      </div>
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
