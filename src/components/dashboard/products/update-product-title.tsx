"use client";

import { useState, useTransition } from "react";
import { updateProductTitle } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Pencil, X, Check } from "lucide-react";

interface UpdateProductTitleProps {
  productId: number;
  currentTitle: string;
}

export function UpdateProductTitle({
  productId,
  currentTitle,
}: UpdateProductTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(currentTitle);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title cannot be empty");
      return;
    }

    startTransition(async () => {
      const result = await updateProductTitle(productId, title);
      
      if (result.success) {
        toast.success("Product title updated successfully");
        setIsEditing(false);
      } else {
        toast.error(result.error || "Failed to update title");
        setTitle(currentTitle);
      }
    });
  };

  const handleCancel = () => {
    setTitle(currentTitle);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2 group">
        <h1 className="text-3xl font-bold">{currentTitle}</h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Edit title</span>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isPending}
        className="text-3xl font-bold h-auto py-1 px-2 w-full max-w-md"
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
