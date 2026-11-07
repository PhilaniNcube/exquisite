import React, { Suspense } from "react";
import Link from "next/link";
import { Route } from "next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPhotoDeletionRequests } from "@/lib/queries/photoDeletionRequests";
import { PhotoRequestsTable } from "@/components/dashboard/photo-requests/photo-requests-table";
import { Pagination } from "@/components/dashboard/school-photos/pagination";

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In review", value: "in_review" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Completed", value: "completed" },
];

export default function PhotoRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Photo Removal Requests</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Parents can request removal of photos of their children. Requested
          photos are hidden from the public gallery until you approve or reject
          the request.
        </p>
      </div>

      <Suspense fallback={<PhotoRequestsSkeleton />}>
        <PhotoRequestsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function PhotoRequestsContent({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const params = await searchParams;
  const status = params.status || "all";
  const page = params.page ? Number.parseInt(params.page, 10) : 1;

  const requests = await getPhotoDeletionRequests({
    status,
    page: Number.isNaN(page) ? 1 : page,
    limit: 20,
  });

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {statusFilters.map((filter) => {
          const isActive = status === filter.value;
          const href =
            filter.value === "all"
              ? "/dashboard/photo-requests"
              : `/dashboard/photo-requests?status=${filter.value}`;

          return (
            <Button
              key={filter.value}
              asChild
              size="sm"
              variant={isActive ? "default" : "outline"}
            >
              <Link href={href as Route}>{filter.label}</Link>
            </Button>
          );
        })}
      </div>

      <PhotoRequestsTable requests={requests.docs} />

      <Pagination
        page={requests.page || 1}
        totalPages={requests.totalPages}
        hasPrevPage={requests.hasPrevPage}
        hasNextPage={requests.hasNextPage}
        prevPage={requests.prevPage}
        nextPage={requests.nextPage}
        searchParams={params}
        baseUrl="/dashboard/photo-requests"
      />
    </>
  );
}

function PhotoRequestsSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-8 w-20" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="rounded-lg border bg-card p-4">
            <Skeleton className="mb-3 h-6 w-48" />
            <Skeleton className="mb-2 h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
