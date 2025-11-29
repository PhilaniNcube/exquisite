import { Suspense } from "react";
import SchoolPhotoDetails from "../../../../../components/dashboard/school-photos/school-photo-details";

export default async function SchoolPhotoPage({
  params,
}: {
  params: Promise<{ schoolPhotoId: string }>;
}) {
  return (
    <Suspense>
      <SchoolPhotoDetails params={params} />
    </Suspense>
  );
}
