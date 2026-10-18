"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Printer, Loader2, FileCheck } from "lucide-react";
import { Order } from "@/payload-types";
import { generateOrderProofPDF } from "@/lib/pdf/order-proof";
import { toast } from "sonner";

interface OrderProofButtonProps {
  order: Order;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  showPrint?: boolean;
  className?: string;
}

export function OrderProofButton({
  order,
  variant = "outline",
  size = "default",
  showPrint = true,
  className = "",
}: OrderProofButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = () => {
    try {
      setIsGenerating(true);
      generateOrderProofPDF(order);
      toast.success("Order proof downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate order proof PDF:", error);
      toast.error("Failed to generate PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant={variant}
        size={size}
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="gap-2 shrink-0 font-medium"
      >
        {isGenerating ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <FileCheck className="h-4 w-4 text-primary" />
        )}
        Download Proof (PDF)
      </Button>

      {showPrint && (
        <Button
          variant="ghost"
          size={size}
          onClick={handlePrint}
          className="gap-2 shrink-0 text-muted-foreground hover:text-foreground hidden sm:inline-flex"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>
      )}
    </div>
  );
}
