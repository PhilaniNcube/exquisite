import UsersList from "@/components/dashboard/users/users-list";
import { UsersTableSkeleton } from "@/components/dashboard/users/users-table-skeleton";
import React, { Suspense } from "react";

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <Suspense fallback={<UsersTableSkeleton />}>
        <UsersList searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
