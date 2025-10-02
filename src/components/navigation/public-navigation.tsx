"use client"

import Link from 'next/link'
import React from 'react'
import { Route } from 'next'
import MobileSheet from './mobile-sheet'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

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

const PublicNavigation = () => {
  return (
    <nav className='bg-white shadow-sm border-b'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16'>
           <Link href="/" className='flex items-center'>
              <span className='font-bold text-xl text-gray-900'>Exquisite Photography</span>
           </Link>
           
           {/* Desktop Navigation */}
           <div className='hidden md:flex items-center'>
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Portfolio</NavigationMenuTrigger>
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
                    <Link href="/about" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        About
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link href="/orders" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Orders
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link href="/contact" legacyBehavior passHref>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Contact Us
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
           </div>

           {/* Mobile Navigation */}
           <MobileSheet />
        </div>
    </nav>
  )
}

export default PublicNavigation