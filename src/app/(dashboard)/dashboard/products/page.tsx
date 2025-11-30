import React, { Suspense } from "react";
import ProductsTable from "@/components/dashboard/products/products-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <Link href="/dashboard/products/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        </Link>
      </div>
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductsTable searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
