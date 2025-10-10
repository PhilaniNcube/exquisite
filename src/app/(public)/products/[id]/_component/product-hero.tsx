"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const ProductHero = () => {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Back Button */}
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Products</span>
            <span className="sm:hidden">Back</span>
          </Button>

          {/* Logo/Brand */}
          <Link
            href="/"
            className="font-serif text-xl md:text-2xl text-foreground"
          >
            Home
          </Link>

          {/* Spacer for layout balance */}
          <div className="w-[100px]" />
        </div>
      </div>
    </header>
  );
};

export default ProductHero;
