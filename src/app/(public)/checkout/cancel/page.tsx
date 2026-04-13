import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";

async function CancelContent({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  const { orderId } = searchParams;

  if (!orderId) {
    redirect("/checkout");
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:px-8 lg:py-24">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <XCircle className="w-16 h-16 text-red-500" />
            </div>
            <CardTitle className="text-3xl">Payment Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-muted-foreground">
              <p className="mb-2">
                Your payment was cancelled. No charges have been made.
              </p>
              <p className="text-sm">
                Order ID: <span className="font-mono font-semibold">{orderId}</span>
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What would you like to do?</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Return to checkout to try again</li>
                <li>• Continue shopping and checkout later</li>
                <li>• Contact us if you need assistance</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1">
                <Link href="/checkout">Return to Checkout</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>

            <div className="text-center">
              <Button asChild variant="link" size="sm">
                <Link href="/contact">Need Help? Contact Support</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CheckoutCancelPage({
  searchParams,
}: {
  searchParams: { orderId?: string };
}) {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 text-center">
          Loading...
        </div>
      }
    >
      <CancelContent searchParams={searchParams} />
    </Suspense>
  );
}
