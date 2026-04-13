"use client";

import { useCartStore } from "@/store/cart-store";
import { useEffect, useRef } from "react";

export function ClearCart() {
  const clearCart = useCartStore((s) => s.clearCart);
  const cleared = useRef(false);

  useEffect(() => {
    if (!cleared.current) {
      cleared.current = true;
      clearCart();
    }
  }, [clearCart]);

  return null;
}
