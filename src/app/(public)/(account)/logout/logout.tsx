'use client';

import { Button } from "@/components/ui/button";
import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { UserX2 } from "lucide-react";
import { logoutAction } from "@/lib/actions/auth/logout";

const Logout = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  console.log('[Logout Component] Component rendered, logoutAction type:', typeof logoutAction);

  const handleLogout = () => {
    console.log('[Logout Component] Button clicked, starting logout...');
    console.log('[Logout Component] logoutAction is:', logoutAction);
    
    startTransition(async () => {
      console.log('[Logout Component] Inside startTransition callback');
      try {
        console.log('[Logout Component] About to call logoutAction...');
        const result = await logoutAction();
        console.log('[Logout Component] logoutAction returned:', result);
        
        if (result.success) {
          console.log('[Logout Component] Logout successful, redirecting to home...');
          router.push('/');
          router.refresh();
        } else {
          console.error('[Logout Component] Logout failed:', result.error);
        }
      } catch (error) {
        console.error('[Logout Component] Error caught in try-catch:', error);
        console.error('[Logout Component] Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined,
          name: error instanceof Error ? error.name : undefined
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
