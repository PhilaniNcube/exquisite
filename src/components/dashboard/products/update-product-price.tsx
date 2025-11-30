"use client";

import { useState, useTransition } from "react";
import { updateProductPrice } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, X, Check } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface UpdateProductPriceProps {
  productId: number;
  currentPrice: number;
}

export function UpdateProductPrice({
  productId,
  currentPrice,
}: UpdateProductPriceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(currentPrice.toString());
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const priceValue = parseFloat(price);
    
    if (isNaN(priceValue) || priceValue <= 0) {
      toast.error("Please enter a valid price");
      return;
    }

    startTransition(async () => {
      const result = await updateProductPrice(productId, priceValue);
      
      if (result.success) {
        toast.success("Product price updated successfully");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Failed to update price");
        setPrice(currentPrice.toString());
      }
    });
  };

  const handleCancel = () => {
    setPrice(currentPrice.toString());
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 group mt-2">
        <p className="text-2xl font-semibold">{formatPrice(currentPrice)}</p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Edit price</span>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
      <Input
        type="number"
        step="0.01"
        min="0"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        disabled={isPending}
        className="text-2xl font-semibold h-auto py-1 px-2 w-40"
        autoFocus
      />
      <div className="flex gap-1">
        <Button type="submit" disabled={isPending} size="icon" variant="ghost" className="h-8 w-8">
          <Check className="h-4 w-4 text-green-600" />
          <span className="sr-only">Save</span>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          disabled={isPending}
          className="h-8 w-8"
        >
          <X className="h-4 w-4 text-red-600" />
          <span className="sr-only">Cancel</span>
        </Button>
      </div>
    </form>
  );
}
