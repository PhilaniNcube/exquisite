"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { lookupGuestOrder } from "@/lib/actions/orders/lookup";

export function GuestOrderLookupForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await lookupGuestOrder(orderId, email);
      if (result.success && result.orderId) {
        router.push(`/orders?orderId=${result.orderId}`);
      } else {
        setError(result.error || "Order not found. Please check your details.");
      }
    });
  };

  return (
    <form onSubmit={handleLookup} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="orderNumber">Order Number</Label>
        <Input
          id="orderNumber"
          type="text"
          placeholder="e.g. 1042"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="orderEmail">Email used at checkout</Label>
        <Input
          id="orderEmail"
          type="email"
          placeholder="e.g. parent@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
        />
      </div>

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-md flex items-start gap-2">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <Button type="submit" variant="default" className="w-full gap-2" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching...
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Find Order & View Proof
          </>
        )}
      </Button>
    </form>
  );
}
