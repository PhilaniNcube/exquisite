import React, { Suspense } from 'react'
import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import SchoolHeader from "./_components/school-header";
import SchoolPhotosSection from "./_components/school-photos-section";
import PassCodeForm from "./_components/pass-code-form";
import { SchoolPageSkeleton, SchoolGallerySkeleton } from "./_components/skeletons";

const SchoolAccessGate = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pass_code?: string; page?: string }>;
}) => {
  const [{ id }, { pass_code, page }] = await Promise.all([params, searchParams]);

  const payload = await getPayload({ config });

  const school = await payload.findByID({
    collection: "schools",
    id: id,
    depth: 1,
  });

  if (!school) {
    notFound();
  }

  if (!pass_code || pass_code !== school.pass_code) {
    return <PassCodeForm schoolId={id} schoolName={school.name} />;
  }

  const currentPage = Number(page) || 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolHeader school={school} />
      <Suspense fallback={<SchoolGallerySkeleton />}>
        <SchoolPhotosSection schoolId={id} schoolName={school.name} page={currentPage} />
      </Suspense>
    </div>
  );
};

const SchoolPage = ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ pass_code?: string; page?: string }>;
}) => {
  return (
    <Suspense fallback={<SchoolPageSkeleton />}>
      <SchoolAccessGate params={params} searchParams={searchParams} />
    </Suspense>
  );
};

export default SchoolPage