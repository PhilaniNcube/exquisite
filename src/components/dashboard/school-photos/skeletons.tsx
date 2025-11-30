import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

export function SchoolPhotosFilterSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 items-end">
      <div className="w-full sm:w-[200px]">
        <Skeleton className="h-5 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="w-full sm:w-[200px]">
        <Skeleton className="h-5 w-16 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  )
}

export function SchoolPhotosListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <Skeleton className="h-full w-full" />
            </div>
          </CardContent>
          <CardFooter className="p-4 flex flex-col items-start gap-2">
            <div className="flex justify-between items-center w-full">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-9 w-16" />
            </div>
            <div className="w-full space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
