import React, { Suspense } from "react";
import { CustomerLoginForm } from "./components/customer-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, ReceiptText } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Parent & Customer Sign In | Exquisite Photography",
  description: "Sign in to view your school photo order history, track status, and download official order proofs.",
};

interface LoginPageProps {
  searchParams: Promise<{
    redirect?: string;
  }>;
}

const LoginContent = async ({ searchParams }: LoginPageProps) => {
  const { redirect: redirectUrl } = await searchParams;

  const isOrderRedirect = redirectUrl?.includes("/orders");
  const isCheckoutRedirect = redirectUrl?.includes("/checkout");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        {/* Contextual Notice */}
        {isOrderRedirect && (
          <div className="bg-primary/10 border border-primary/20 text-slate-800 rounded-lg p-4 flex items-start gap-3 shadow-xs">
            <ReceiptText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-sm text-foreground">
                Sign in to view your Order Proof & History
              </p>
              <p className="text-muted-foreground">
                Enter your parent account details below to access all your current and past photo orders.
              </p>
            </div>
          </div>
        )}

        {isCheckoutRedirect && (
          <div className="bg-primary/10 border border-primary/20 text-slate-800 rounded-lg p-4 flex items-start gap-3 shadow-xs">
            <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-sm text-foreground">
                Sign in to save this order to your account
              </p>
              <p className="text-muted-foreground">
                Signing in links your school photo order so you can easily track it and download proof of order later.
              </p>
            </div>
          </div>
        )}

        <Card className="border border-border shadow-md">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Sign In
            </CardTitle>
            <CardDescription className="text-sm">
              Sign in to your Exquisite Photography account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerLoginForm />
          </CardContent>
        </Card>

        {/* Guest reassurance */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Exquisite Photography • Secure School Photo Ordering</p>
        </div>
      </div>
    </div>
  );
};

const LoginPage = (props: LoginPageProps) => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-4">
            <Skeleton className="h-10 w-48 mx-auto" />
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        </div>
      }
    >
      <LoginContent {...props} />
    </Suspense>
  );
};

export default LoginPage;
