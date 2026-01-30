'use client';

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { UserX2 } from "lucide-react";

const Logout = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setIsPending(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (response.ok) {
        router.push('/');
        router.refresh();
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleLogout} disabled={isPending}>
      <UserX2 className="mr-2 h-4 w-4" />
      {isPending ? "Signing Out..." : "Sign Out"}
    </Button>
  );
};

export default Logout;
