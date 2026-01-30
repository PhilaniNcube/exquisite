'use client';

import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import { logoutAction } from "./logoutAction";
import { UserX2 } from "lucide-react";

const Logout = () => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isPending}>
      <UserX2 className="mr-2 h-4 w-4" />
      {isPending ? "Signing Out..." : "Sign Out"}
    </Button>
  );
};

export default Logout;
