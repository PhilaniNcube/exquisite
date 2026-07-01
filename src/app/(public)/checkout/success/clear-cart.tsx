"use client";

import { useCartStore } from "@/store/cart-store";
import { useEffect, useRef } from "react";

interface ClearCartProps {
  /**
   * Only clear the cart when this is true. The parent (success page) must
   * gate this on server-side payment verification so the cart is never wiped
   * out for an unpaid/cancelled order.
   */
  shouldClear: boolean;
}

export function ClearCart({ shouldClear }: ClearCartProps) {
  const clearCart = useCartStore((s) => s.clearCart);
  const cleared = useRef(false);

  useEffect(() => {
    if (shouldClear && !cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [shouldClear, clearCart]);

  return null;
}