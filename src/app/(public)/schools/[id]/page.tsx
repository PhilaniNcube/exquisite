import React, { Suspense } from 'react'
import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { getSchoolPhotosBySchoolId } from "@/lib/queries/schoolPhotos";
import { getClassesBySchoolId } from "@/lib/queries/classes";
import SchoolHeader from "./_components/school-header";
import SchoolPhotosGallery from "./_components/school-photos-gallery";
import PassCodeForm from "./_components/pass-code-form";

const SchoolContent = async ({
  params,
  searchParams
}: {
  params: Promise<{id: string}>;
  searchParams: Promise<{pass_code?: string}>;
}) => {
  const { id } = await params;
  const { pass_code } = await searchParams;
  
  const payload = await getPayload({ config });
  
  // Fetch school data
  const school = await payload.findByID({
    collection: "schools",
    id: id,
    depth: 1,
  });

  if (!school) {
    notFound();
  }

  // Check if pass_code is provided and matches
  if (!pass_code || pass_code !== school.pass_code) {
    return <PassCodeForm schoolId={id} schoolName={school.name} />;
  }

  // Fetch school photos and classes
  const [photosData, classesData] = await Promise.all([
    getSchoolPhotosBySchoolId(id, { limit: 50 }),
    getClassesBySchoolId(id)
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolHeader school={school} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SchoolPhotosGallery 
          photos={photosData.docs} 
          classes={classesData.docs}
          schoolName={school.name} 
        />
      </div>
    </div>
  );
};

const SchoolPage = ({
  params,
  searchParams
}: {
  params: Promise<{id: string}>;
  searchParams: Promise<{pass_code?: string}>;
}) => {
  return (
    <Suspense fallback={<div>Loading school...</div>}>
      <SchoolContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

export default SchoolPage