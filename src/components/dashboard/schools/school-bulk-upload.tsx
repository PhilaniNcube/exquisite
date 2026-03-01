import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SchoolBulkUploadPhotos } from "./school-bulk-upload-photos";

export default async function SchoolBulkUpload({
  params,
}: {
  params: Promise<{ schoolId: string }>;
}) {
  const { schoolId } = await params;
  const id = parseInt(schoolId, 10);
  if (isNaN(id)) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <h3 className="text-lg font-semibold">Bulk Upload Photos</h3>
          <p className="text-sm text-muted-foreground">
            Upload multiple photos to a class in this school
          </p>
        </div>
        <SchoolBulkUploadPhotos schoolId={id} />
      </CardHeader>
      <CardContent />
    </Card>
  );
}
