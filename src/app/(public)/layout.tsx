import PublicNavigation from "@/components/navigation/public-navigation";
import React from "react";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getCategories } from "@/lib/queries/categories";
import AuthLinks from "@/components/navigation/auth-links";
import { Footer } from "@/components/navigation/footer";
import { CartProvider } from "@/components/providers/cart-provider";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const PublicLayout = async ({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) => {
  const { docs: categories } = await getCategories();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <PublicNavigation categories={categories}>
            <AuthLinks />
          </PublicNavigation>
          <NuqsAdapter>
            {children}
            {modal}
          </NuqsAdapter>
          <div id="modal-root" />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
};

export default PublicLayout;
