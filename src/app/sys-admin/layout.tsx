import React from "react"
import "../../app/globals.css"
import { Geist_Mono, Raleway } from "next/font/google"

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} ${geistMono.variable} antialiased min-h-screen flex items-center justify-center bg-muted/40`}>
        <div className="w-full max-w-md p-4">
          {children}
        </div>
      </body>
    </html>
  )
}
