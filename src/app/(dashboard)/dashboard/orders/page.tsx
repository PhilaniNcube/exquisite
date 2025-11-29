import React, { Suspense } from 'react'
import OrdersList from './_components/orders-list'

interface PageProps {
  searchParams: Promise<{ page?: string }>
}

export default function OrdersPage({ searchParams }: PageProps) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Orders</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <OrdersList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
