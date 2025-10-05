import React from "react";
import { CustomerLoginForm } from "./components/customer-login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

const LoginPage = () => {
  return (
    <div className="bg-slate-700 min-h-screen flex flex-col justify-center mx-auto py-8">
      <Card className="text-center mb-8 max-w-5xl mx-auto">
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription className="text-muted-foreground">
          Sign in to your account
        </CardDescription>
        <CardContent>
          <CustomerLoginForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
