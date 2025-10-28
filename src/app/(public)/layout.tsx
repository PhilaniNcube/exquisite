import PublicNavigation from "@/components/navigation/public-navigation";
import React from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Geist_Mono, Raleway } from "next/font/google";
import "../globals.css";
import { getCategories } from "@/lib/queries/categories";
import AuthLinks from "@/components/navigation/auth-links";
import { Footer } from "@/components/navigation/footer";
import { CartProvider } from "@/components/providers/cart-provider";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

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
      <body className={`${raleway.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <PublicNavigation categories={categories}>
            <Suspense
              fallback={
                <div className="flex flex-col md:flex-row px-4 md:items-center space-x-4 space-y-2 md:space-y-0 md:mt-0">
                  <Skeleton className="w-24 h-10 rounded-md" />
                  <Skeleton className="w-24 h-10 rounded-md" />
                </div>
              }
            >
              <AuthLinks />
            </Suspense>
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
