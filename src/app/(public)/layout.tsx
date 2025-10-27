import PublicNavigation from "@/components/navigation/public-navigation";
import React from "react";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import {  Geist_Mono, Raleway } from "next/font/google";
import "../globals.css";
import { getCategories } from "@/lib/queries/categories";
import AuthLinks from "@/components/navigation/auth-links";
import { Footer } from "@/components/navigation/footer";
import { CartProvider } from "@/components/providers/cart-provider";
import Template from "./template";


const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["400", "700"],
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
        className={`${raleway.variable} ${geistMono.variable} antialiased`}
      >
        <Template>
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
        </Template>
      </body>
    </html>
  );
};

export default PublicLayout;
