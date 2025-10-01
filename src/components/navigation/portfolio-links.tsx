"use client";

import { Route } from 'next';
import Link from 'next/link';
import React from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

type PortfolioItem = {
    href: Route;
    label: string;
}

const portfolioItems: PortfolioItem[] = [
    { href: '/portfolio/weddings', label: 'Weddings' },
    { href: '/portfolio/matric', label: 'Matric Farewells' },
    { href: '/portfolio/school', label: 'School' },
    { href: '/portfolio/creches', label: 'Creches' },
    { href: '/portfolio/families', label: 'Families & Couples' },
    { href: '/portfolio/portraits', label: 'Portraits' },
];

const PortfolioLinks = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className=''>
          <NavigationMenuTrigger>
            <Link href="/portfolio" className='text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200'>
            Portfolio
            </Link>
            </NavigationMenuTrigger>
          <NavigationMenuContent className=''>
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
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export default PortfolioLinks