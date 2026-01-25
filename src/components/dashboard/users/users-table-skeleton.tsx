import { Skeleton } from "@/components/ui/skeleton";

export function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 py-4">
        <Skeleton className="h-10 max-w-sm flex-1" />
        <Skeleton className="h-10 max-w-sm flex-1" />
        <Skeleton className="h-10 w-24 ml-auto" />
      </div>
      <div className="rounded-md border p-4">
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  );
}
