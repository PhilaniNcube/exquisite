"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Route } from "next";
import MobileSheet from "./mobile-sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

type PortfolioItem = {
  href: Route;
  label: string;
};

type PortfolioCategory = {
  slug: string;
  name: string;
};

type PublicNavigationProps = {
  categories: PortfolioCategory[];
  children?: React.ReactNode;
};

const PublicNavigation = ({ categories, children }: PublicNavigationProps) => {
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const portfolioItems: PortfolioItem[] = categories.map((category) => ({
    href: `/portfolio/${category.slug}` as Route,
    label: category.name,
  }));

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-xl text-gray-900">
              Exquisite Photography
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem asChild>
                  <NavigationMenuLink
                    asChild
                    className={`${navigationMenuTriggerStyle()} bg-transparent`}
                  >
                    <Link href="/" passHref>
                      <span
                        className={cn(
                          isScrolled ? "text-black" : "text-white",
                          "font-medium"
                        )}
                      >
                        Home
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger
                    className={cn(
                      isScrolled ? "text-black" : "text-white",
                      "font-medium bg-transparent"
                    )}
                  >
                    <span
                      className={cn(
                        isScrolled ? "text-black" : "text-white",
                        "font-medium"
                      )}
                    >
                      Portfolio
                    </span>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px] lg:grid-cols-2">
                      {portfolioItems.map((item) => (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {item.label}
                            </div>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`${navigationMenuTriggerStyle()} bg-transparent`}
                  >
                    <Link href="/about" passHref>
                      <span
                        className={cn(
                          isScrolled ? "text-black" : "text-white",
                          "font-medium"
                        )}
                      >
                        About
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`${navigationMenuTriggerStyle()} bg-transparent`}
                  >
                    <Link href="/orders" passHref>
                      <span className={cn(
                        isScrolled ? "text-black" : "text-white",
                        "font-medium"
                      )}>
                      Orders
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuLink
                    asChild
                    className={`${navigationMenuTriggerStyle()} bg-transparent hover:text-black`}
                  >
                    <Link href="/contact" passHref>
                      <span className={cn(
                        isScrolled ? "text-black" : "text-white",
                        "font-medium "
                      )}>
                      Contact Us
                      </span>
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {children}
          </div>

          {/* Mobile Navigation */}
          <MobileSheet>
            {children}
          </MobileSheet>
        </div>
      </div>
    </header>
  );
};

export default PublicNavigation;
