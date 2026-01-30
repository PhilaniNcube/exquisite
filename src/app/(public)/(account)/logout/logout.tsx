'use client';

import { Button } from "@/components/ui/button";
import React, { useState, useTransition } from "react";
import { UserX2 } from "lucide-react";
import { logoutAction } from "./logoutAction";

const Logout = () => {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    console.log('[Logout Component] Button clicked, starting logout...');
    startTransition(async () => {
      console.log('[Logout Component] Transition started');
      try {
        console.log('[Logout Component] Calling logoutAction...');
        await logoutAction();
        console.log('[Logout Component] logoutAction completed successfully');
      } catch (error) {
        console.error('[Logout Component] Error caught:', error);
        console.error('[Logout Component] Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
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
