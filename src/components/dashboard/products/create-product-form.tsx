"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createProduct, uploadProductImage } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel } from "@/components/ui/form";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().min(0, "Price must be a positive number"),
  productDetails: z.string().min(1, "Product details are required"),
  // We'll handle image validation manually or via a separate check, 
  // but keeping it in schema helps with type inference if we want.
  // However, since file inputs are uncontrolled usually, we'll just check state.
});

export function CreateProductForm() {
  const [isPending, startTransition] = useTransition();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      price: 0,
      productDetails: "",
    },
  });

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

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFile) {
      toast.error("Please select an image");
      return;
    }

    startTransition(async () => {
      try {
        // 1. Upload Image
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        const uploadResult = await uploadProductImage(formData);
        
        if (!uploadResult.success || !uploadResult.media) {
          toast.error(uploadResult.error || "Failed to upload image");
          return;
        }

        // 2. Create Product
        const result = await createProduct({
          title: values.title,
          price: values.price,
          imageId: uploadResult.media.id,
          productDetails: values.productDetails,
        });

        if (result.success) {
          toast.success("Product created successfully");
          form.reset();
          removeImage();
        } else {
          toast.error(result.error || "Failed to create product");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Field
          control={form.control}
          name="title"
          label="Product Title"
        >
          <Input placeholder="Enter product title" />
        </Field>

        <Field
          control={form.control}
          name="price"
          label="Price"
        >
          {(field) => (
            <Input 
              type="number" 
              placeholder="0.00" 
              {...field}
              onChange={(e) => field.onChange(e.target.valueAsNumber)}
            />
          )}
        </Field>

        <FormItem>
          <FormLabel>Product Image</FormLabel>
          <div className="flex flex-col gap-4">
            {previewUrl ? (
              <div className="relative w-full max-w-xs aspect-square rounded-lg overflow-hidden border">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full max-w-xs aspect-square border-2 border-dashed rounded-lg hover:bg-muted/50 transition-colors">
                <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Upload Image
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            )}
          </div>
        </FormItem>

        <Field
          control={form.control}
          name="productDetails"
          label="Product Details"
        >
          <Textarea
            placeholder="Enter product details..."
            className="min-h-[150px]"
          />
        </Field>

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Product
        </Button>
      </form>
    </Form>
  );
}
