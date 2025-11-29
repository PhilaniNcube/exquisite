import React, { Suspense } from 'react'
import OrderDetails from './_components/order-details'
import { Skeleton } from '@/components/ui/skeleton'

interface PageProps {
  params: Promise<{ orderId: string }>
}

export default function OrderPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Order Details</h1>
      </div>
      <Suspense fallback={<OrderDetailsSkeleton />}>
        <OrderDetails params={params} />
      </Suspense>
    </div>
  )
}

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-[200px]" />
        <Skeleton className="h-[200px]" />
      </div>
      <Skeleton className="h-[300px]" />
    </div>
  )
}
