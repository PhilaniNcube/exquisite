import React, { Suspense } from 'react'
import ProductsTable from '@/components/dashboard/products/products-table'

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Products</h1>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsTable searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
