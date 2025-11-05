"use client";

import React, { startTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryState } from "nuqs";
import { usePathname, useRouter } from "next/navigation";
import { Route } from "next";

const SchoolsHero = () => {
  const [search, setSearch] = useQueryState("search", { defaultValue: "" });
  const router = useRouter();

  const pathname = usePathname();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Form submission is handled by the search state update

    startTransition(() => {
      // This will trigger a re-render with the updated search query
      router.push(`${pathname}/?search=${encodeURIComponent(search)}` as Route);
    });
  };

  return (
    <section className="relative bg-linear-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
             School
            <span className="block text-yellow-400">Photography Portfolio</span>
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
          Find the school that your child goes to and order the prints you want.
          </p>

          <div className="mb-12">
            <form
              onSubmit={handleSubmit}
              className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4"
            >
              <Input
                type="search"
                name="search"
                placeholder="Search schools by name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 h-14 px-6 text-lg bg-white text-gray-900 border-0 focus-visible:ring-4 focus-visible:ring-yellow-400/50"
              />

              <Button
                type="submit"
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold h-14 px-8 text-lg"
              >
                Browse Schools
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchoolsHero;
