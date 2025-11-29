import React, { Suspense } from "react";
import SchoolDetails from "@/components/dashboard/schools/school-details";
import SchoolClasses from "@/components/dashboard/schools/school-classes";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const SchoolPage = async ({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) => {
  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/schools">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">School Details</h1>
      </div>
      
      <Suspense fallback={<SchoolDetailsSkeleton />}>
        <SchoolDetails params={params} />
      </Suspense>

      <Suspense fallback={<SchoolClassesSkeleton />}>
        <SchoolClasses params={params} />
      </Suspense>
    </div>
  );
};

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
  )
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
  )
}

export default SchoolPage;
