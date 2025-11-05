import { searchSchools } from "@/lib/queries/schools";
import React, { Suspense } from "react";
import SchoolsHero from "./_components/schools-hero";
import SchoolsGrid from "./_components/schools-grid";
import SchoolsFallback from "./_components/schools-fallback";
import { School } from "@/payload-types";

const SchoolsContent = async ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  const resolvedSearchParams = await searchParams;
  const schoolsData = await searchSchools(
    (resolvedSearchParams.search as string) || ""
  );

  return <SchoolsGrid schools={schoolsData.docs as School[]} />;
};

const page = ({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) => {
  return (
    <div>
      <SchoolsHero />

      <Suspense fallback={<SchoolsFallback />}>
        <SchoolsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
};

export default page;
