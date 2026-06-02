"use client";

import { useState, useTransition } from "react";
import { updateProductAvailability } from "@/lib/actions/products";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface UpdateProductAvailabilityProps {
  productId: number;
  currentAvailable: boolean;
}

export function UpdateProductAvailability({
  productId,
  currentAvailable,
}: UpdateProductAvailabilityProps) {
  const router = useRouter();
  const [available, setAvailable] = useState(currentAvailable);
  const [isPending, startTransition] = useTransition();

  const handleToggle = (checked: boolean) => {
    // Optimistically update local state
    setAvailable(checked);

    startTransition(async () => {
      const result = await updateProductAvailability(productId, checked);
      if (result.success) {
        toast.success(
          checked
            ? "Product is now available for group/sports photos"
            : "Product is no longer available for group/sports photos"
        );
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update availability");
        // Revert on failure
        setAvailable(!checked);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Availability Settings
          {isPending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </CardTitle>
        <CardDescription>
          Control where this product can be purchased on the site.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
          <div className="space-y-0.5 max-w-[80%]">
            <Label htmlFor="group-sports-toggle" className="text-base font-semibold">
              Available for Group/Sports Photos
            </Label>
            <p className="text-sm text-muted-foreground">
              Allow customers to purchase this product for all group, sports, and class photos.
            </p>
          </div>
          <Switch
            id="group-sports-toggle"
            checked={available}
            onCheckedChange={handleToggle}
            disabled={isPending}
          />
        </div>
      </CardContent>
    </Card>
  );
}
