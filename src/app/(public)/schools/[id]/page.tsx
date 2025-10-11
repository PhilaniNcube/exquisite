import React from 'react'
import { getPayload } from "payload";
import config from "@payload-config";
import { notFound } from "next/navigation";
import { getSchoolPhotosBySchoolId } from "@/lib/queries/schoolPhotos";
import { getClassesBySchoolId } from "@/lib/queries/classes";
import SchoolHeader from "./_components/school-header";
import SchoolPhotosGallery from "./_components/school-photos-gallery";

const SchoolPage = async ({params}: {params: Promise<{id: string}>}) => {
  const { id } = await params;
  
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
  )
}

export default SchoolPage