import { getSchoolPhotosBySchoolId } from "@/lib/queries/schoolPhotos";
import { getClassesBySchoolId } from "@/lib/queries/classes";
import SchoolPhotosGallery from "./school-photos-gallery";

const SchoolPhotosSection = async ({
  schoolId,
  schoolName,
  page = 1,
}: {
  schoolId: string;
  schoolName: string;
  page?: number;
}) => {
  const [photosData, classesData] = await Promise.all([
    getSchoolPhotosBySchoolId(schoolId, { limit: 36, page }),
    getClassesBySchoolId(schoolId, { limit: 1000 }),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SchoolPhotosGallery
        photos={photosData.docs}
        classes={classesData.docs}
        schoolName={schoolName}
        totalPages={photosData.totalPages}
        currentPage={photosData.page || 1}
      />
    </div>
  );
};

export default SchoolPhotosSection;
