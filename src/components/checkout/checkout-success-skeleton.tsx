import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton shown while the /checkout/success page awaits its async server work
 * (order lookup + PayGate payment verification). Mirrors the success page
 * layout — header card, status card, order items card, action buttons — so the
 * real content streams in without a layout shift.
 *
 * NOTE: this only renders during the initial RSC payload resolution; the page
 * does not stream per-chunk, so this fallback primarily covers the
 * searchParams promise + server-side findByID/verify round trips.
 */
export function CheckoutSuccessPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-24">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Success Header */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Skeleton className="h-16 w-16 rounded-full" />
            </div>
            <CardTitle className="flex justify-center">
              <Skeleton className="h-8 w-56" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <Skeleton className="h-5 w-80 mx-auto" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <Skeleton className="h-5 w-40" />
              <div className="space-y-2 pt-1">
                <Skeleton className="h-4 w-72" />
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-6 w-24" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-36" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-7 w-32" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between items-start gap-6"
              >
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-44" />
                  <Skeleton className="h-4 w-36" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))}

            <Skeleton className="h-px w-full" />

            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 w-full sm:flex-1" />
          <Skeleton className="h-10 w-full sm:flex-1" />
        </div>
      </div>
    </div>
  );
}