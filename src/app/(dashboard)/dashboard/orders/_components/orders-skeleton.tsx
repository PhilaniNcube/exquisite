import React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

export function OrdersListSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Filters Skeleton */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-55 rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-55 rounded-md" />
        </div>
      </div>

      {/* Orders Cards Skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, idx) => (
          <div key={idx} className="rounded-lg border bg-card p-0">
            {/* Order Header Skeleton */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b">
              <div className="flex items-center gap-4">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-32" />
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>

            {/* Customer & School Info Skeleton */}
            <div className="px-4 py-2 border-b flex flex-wrap gap-x-6 gap-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
            </div>

            {/* Line Items Skeleton */}
            <div className="p-4 space-y-3">
              {Array.from({ length: 2 }).map((_, itemIdx) => (
                <div key={itemIdx} className="flex items-center gap-3">
                  {/* Thumbnails */}
                  <Skeleton className="w-12 h-12 rounded shrink-0" />
                  <Skeleton className="w-12 h-12 rounded shrink-0" />

                  {/* Item Details */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>

                  {/* Qty & Price */}
                  <div className="text-right space-y-2 shrink-0">
                    <Skeleton className="h-4 w-20 ml-auto" />
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-2 pt-2">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  )
}
