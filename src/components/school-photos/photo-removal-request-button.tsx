"use client";

import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SchoolPhoto } from "@/payload-types";
import { PhotoRemovalRequestDialog } from "./photo-removal-request-dialog";
import { cn } from "@/lib/utils";

interface PhotoRemovalRequestButtonProps {
  photo: SchoolPhoto;
  schoolName?: string;
  label?: string;
  className?: string;
  variant?: React.ComponentProps<typeof Button>["variant"];
  size?: React.ComponentProps<typeof Button>["size"];
}

export function PhotoRemovalRequestButton({
  photo,
  schoolName,
  label = "Request removal",
  className,
  variant = "outline",
  size = "sm",
}: PhotoRemovalRequestButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size}
        className={cn(className)}
        onClick={() => setOpen(true)}
        title="Request removal of this photo"
      >
        <ShieldAlert className="h-4 w-4" />
        <span>{label}</span>
      </Button>
      <PhotoRemovalRequestDialog
        photo={photo}
        schoolName={schoolName}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
