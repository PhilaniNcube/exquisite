"use client";

import { useState, useTransition, useRef } from "react";
import { updateProductImage, uploadProductImage } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, X, Check, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import type { Media } from "@/payload-types";
import { Input } from "@/components/ui/input";

interface UpdateProductImageProps {
  productId: number;
  currentImage: Media;
}

export function UpdateProductImage({
  productId,
  currentImage,
}: UpdateProductImageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    startTransition(async () => {
      // First upload the image
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const uploadResult = await uploadProductImage(formData);
      
      if (!uploadResult.success || !uploadResult.media) {
        toast.error(uploadResult.error || "Failed to upload image");
        return;
      }

      // Then update the product with the new image ID
      const updateResult = await updateProductImage(productId, uploadResult.media.id);
      
      if (updateResult.success) {
        toast.success("Product image updated successfully");
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      } else {
        toast.error(updateResult.error || "Failed to update image");
      }
    });
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setIsEditing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            Product Image
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
            {currentImage.url ? (
              <Image
                src={currentImage.url}
                alt={currentImage.alt || "Product image"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Update Product Image</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Select New Image</Label>
            <div className="flex items-center gap-4">
              <Input
                id="image"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isPending}
                className="cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isPending}
              >
                <Upload className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {previewUrl && (
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button type="submit" disabled={isPending || !selectedFile} size="sm">
              {isPending ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Check className="h-4 w-4 mr-1" />
              )}
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
              size="sm"
            >
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
