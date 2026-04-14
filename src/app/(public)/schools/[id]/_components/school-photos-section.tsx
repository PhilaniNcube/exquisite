import { getSchoolPhotosBySchoolId } from "@/lib/queries/schoolPhotos";
import { getClassesBySchoolId } from "@/lib/queries/classes";
import SchoolPhotosGallery from "./school-photos-gallery";

const SchoolPhotosSection = async ({
  schoolId,
  schoolName,
}: {
  schoolId: string;
  schoolName: string;
}) => {
  const [photosData, classesData] = await Promise.all([
    getSchoolPhotosBySchoolId(schoolId, { limit: 50 }),
    getClassesBySchoolId(schoolId),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SchoolPhotosGallery
        photos={photosData.docs}
        classes={classesData.docs}
        schoolName={schoolName}
      />
    </div>
  );
};

export default SchoolPhotosSection;
