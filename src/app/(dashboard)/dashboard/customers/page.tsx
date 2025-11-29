import CustomersList from "@/components/dashboard/customers/customers-list";
import { CustomersTableSkeleton } from "@/components/dashboard/customers/customers-table-skeleton";
import React, { Suspense } from "react";

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Customers</h1>
      <Suspense fallback={<CustomersTableSkeleton />}>
        <CustomersList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
