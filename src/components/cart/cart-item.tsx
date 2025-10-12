"use client";

import { useCartStore } from "@/store/cart-store";
import { CartItem as CartItemType } from "@/types/cart";
import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";
import Image from "next/image";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      removeItem(item.id);
    }
  };

  const handleRemove = () => {
    removeItem(item.id);
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg">
      {item.pictureDetails?.url && (
        <div className="relative w-16 h-16 flex-shrink-0">
          <Image
            src={item.pictureDetails.url}
            alt={item.productDetails?.name || "Product image"}
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm truncate">
          {item.productDetails?.name || "Product"}
        </h4>
        {item.pictureDetails?.name && (
          <p className="text-xs text-muted-foreground truncate">
            {item.pictureDetails.name}
          </p>
        )}
        <p className="text-sm font-medium">
          R{item.priceAtPurchase.toFixed(2)}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleDecrement}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="w-8 text-center text-sm font-medium">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleIncrement}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={handleRemove}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="text-right">
        <p className="text-sm font-medium">
          R{item.linePrice.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
