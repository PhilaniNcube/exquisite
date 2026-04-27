import React, { Suspense } from "react";
import { connection } from "next/server";
import SchoolDetails from "@/components/dashboard/schools/school-details";
import SchoolClasses from "@/components/dashboard/schools/school-classes";
import SchoolPhotos from "@/components/dashboard/schools/school-photos";
import SchoolBulkUpload from "@/components/dashboard/schools/school-bulk-upload";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";

const SchoolPage = ({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) => {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <Suspense fallback={<SchoolPageSkeleton />}>
        <SchoolPageContent params={params} />
      </Suspense>
    </div>
  );
};

async function SchoolPageContent({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  await connection();
  const { schoolId } = await params;

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/schools">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">School Details</h1>
        </div>
        <EditSchoolLink schoolId={schoolId} />
      </div>

      <Suspense fallback={<SchoolDetailsSkeleton />}>
        <SchoolDetails schoolId={schoolId} />
      </Suspense>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<SchoolClassesSkeleton />}>
          <SchoolClasses schoolId={schoolId} />
        </Suspense>

        <Suspense fallback={<SchoolBulkUploadSkeleton />}>
          <SchoolBulkUpload schoolId={schoolId} />
        </Suspense>
      </div>

      <Suspense fallback={<SchoolPhotosSkeleton />}>
        <SchoolPhotos schoolId={schoolId} />
      </Suspense>
    </>
  );
}

function EditSchoolLink({ schoolId }: { schoolId: string }) {
  return (
    <Button asChild variant="outline" size="sm">
      <Link href={`/dashboard/schools/${schoolId}/edit`}>
        <Pencil className="h-4 w-4 mr-2" />
        Edit School
      </Link>
    </Button>
  );
}

function SchoolPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
      <SchoolDetailsSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SchoolClassesSkeleton />
        <SchoolBulkUploadSkeleton />
      </div>
      <SchoolPhotosSkeleton />
    </div>
  );
}

function SchoolDetailsSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <Skeleton className="h-8 w-1/3" />
      </div>
      <div className="p-6 pt-0 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function SchoolClassesSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <Skeleton className="h-8 w-1/4" />
      </div>
      <div className="p-6 pt-0">
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  );
}

function SchoolBulkUploadSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-row items-center justify-between p-6 pb-2">
        <div className="space-y-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>
    </div>
  );
}

function SchoolPhotosSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-row items-center justify-between p-6 pb-2">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="p-6 pt-0 space-y-4">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="aspect-square w-full rounded-md" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SchoolPage;
