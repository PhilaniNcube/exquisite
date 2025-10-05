"use client";

import React from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Route } from "next";

const navigationItems: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/orders", label: "Orders" },
  { href: "/contact", label: "Contact Us" },
];

const MobileSheet = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = React.useState(false);

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">Exquisite Photography</SheetTitle>
          <SheetDescription className="text-left">
            Navigate through our photography services
          </SheetDescription>
        </SheetHeader>
        <nav className="flex flex-col gap-4 mt-6">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleLinkClick}
              className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
         <div className="mt-auto pt-6">{children}</div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSheet;
