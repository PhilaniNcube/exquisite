"use client";

import { useState, useTransition, useRef } from "react";
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
      try {
        const presignResponse = await fetch("/api/products/generate-presigned-url", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            file: {
              name: selectedFile.name,
              type: selectedFile.type,
              size: selectedFile.size,
            },
          }),
        });

        if (!presignResponse.ok) {
          throw new Error("Failed to prepare upload");
        }

        const { uploadUrl, key } = (await presignResponse.json()) as {
          uploadUrl?: string;
          key?: string;
        };

        if (!uploadUrl || !key) {
          throw new Error("Invalid upload URL response");
        }

        const uploadResponse = await fetch(uploadUrl, {
          method: "PUT",
          body: selectedFile,
          headers: {
            "Content-Type": selectedFile.type,
          },
        });

        if (!uploadResponse.ok) {
          throw new Error("Failed to upload image to storage");
        }

        const registerResponse = await fetch("/api/products/register-uploaded-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            key,
            originalName: selectedFile.name,
            type: selectedFile.type,
            size: selectedFile.size,
            alt: selectedFile.name,
          }),
        });

        if (!registerResponse.ok) {
          throw new Error("Failed to register uploaded image");
        }

        const registerResult = (await registerResponse.json()) as {
          success?: boolean;
          error?: string;
        };

        if (!registerResult.success) {
          throw new Error(registerResult.error || "Failed to register image");
        }

        toast.success("Product image updated successfully");
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image");
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
