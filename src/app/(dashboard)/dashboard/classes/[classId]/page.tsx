import React, { Suspense } from "react";
import ClassDetails from "@/components/dashboard/classes/class-details";
import ClassPhotos from "@/components/dashboard/classes/class-photos";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { UploadButtons } from "@/components/dashboard/classes/upload-buttons";

const ClassPage = async ({
  params,
}: {
  params: Promise<{ classId: string }>;
}) => {


  return (
    <div className="container mx-auto py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/classes">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Class Details</h1>
        </div>
        <Suspense fallback={<div className="h-10 w-50 animate-pulse bg-muted rounded-md" />}>
          <UploadButtons params={params} />
        </Suspense>
      </div>
      
      <Suspense fallback={<ClassDetailsSkeleton />}>
        <ClassDetails params={params} />
      </Suspense>

      <Suspense fallback={<ClassPhotosSkeleton />}>
        <ClassPhotos params={params} />
      </Suspense>
    </div>
  );
};

function ClassDetailsSkeleton() {
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
        </div>
      </div>
    </div>
  )
}

function ClassPhotosSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="flex flex-col space-y-1.5 p-6">
        <Skeleton className="h-8 w-1/4" />
      </div>
      <div className="p-6 pt-0">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Skeleton className="aspect-square rounded-md" />
          <Skeleton className="aspect-square rounded-md" />
          <Skeleton className="aspect-square rounded-md" />
          <Skeleton className="aspect-square rounded-md" />
        </div>
      </div>
    </div>
  )
}

export default ClassPage;
