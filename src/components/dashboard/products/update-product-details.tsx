"use client";

import { useState, useTransition } from "react";
import { updateProductDetails } from "@/lib/actions/products";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Pencil, X, Check } from "lucide-react";

interface UpdateProductDetailsProps {
  productId: number;
  currentDetails: any;
}

export function UpdateProductDetails({
  productId,
  currentDetails,
}: UpdateProductDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  // Store as JSON string for editing
  const [details, setDetails] = useState(
    JSON.stringify(currentDetails, null, 2)
  );
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate JSON
      const parsedDetails = JSON.parse(details);
      
      startTransition(async () => {
        const result = await updateProductDetails(productId, parsedDetails);
        
        if (result.success) {
          toast.success("Product details updated successfully");
          setIsEditing(false);
        } else {
          toast.error(result.error || "Failed to update details");
        }
      });
    } catch (error) {
      toast.error("Invalid JSON format");
    }
  };

  const handleCancel = () => {
    setDetails(JSON.stringify(currentDetails, null, 2));
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-lg">
            Product Details
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
          <div className="prose prose-sm max-w-none">
            <pre className="text-sm bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(currentDetails, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Update Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="details">Details (Lexical JSON)</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              disabled={isPending}
              placeholder="Enter product details as JSON"
              rows={15}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Note: This is a Lexical rich text editor JSON structure. Edit with care.
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending} size="sm">
              <Check className="h-4 w-4 mr-1" />
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
