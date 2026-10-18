import React, { Suspense } from "react";
import { CreateCustomerForm } from "./components/create-customer-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Parent Account | Exquisite Photography",
  description: "Create an account to track school photo orders, view history, and download official order proofs.",
};

const CreateAccountPage = () => {
  return (
    <div className="bg-slate-50 mx-auto flex flex-col justify-center py-12 min-h-screen px-4 sm:px-6 lg:px-8">
      <Suspense
        fallback={
          <div className="max-w-md w-full mx-auto space-y-4">
            <Skeleton className="h-8 w-44 mx-auto" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
        }
      >
        <CreateCustomerForm />
      </Suspense>
    </div>
  );
};

export default CreateAccountPage;
