import { getSchools, searchSchools } from "@/lib/queries/schools";
import React from "react";
import SchoolsHero from "./_components/schools-hero";
import SchoolsGrid from "./_components/schools-grid";
import { School } from "@/payload-types";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const resolvedSearchParams = await searchParams;
  const schoolsData = await searchSchools(
    (resolvedSearchParams.search as string) || ""
  );

  return (
    <div>
      <SchoolsHero />
      <SchoolsGrid schools={schoolsData.docs as School[]} />
    </div>
  );
};

export default page;
