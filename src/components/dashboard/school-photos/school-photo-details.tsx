import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSchoolPhotoById } from "@/lib/queries/schoolPhotos";
import { Class, Media, School } from "@/payload-types";
import { Badge, ChevronLeft, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";

const SchoolPhotoDetails = async ({
  params,
}: {
  params: Promise<{ schoolPhotoId: string }>;
}) => {
  const { schoolPhotoId } = await params;

  let photo;
  try {
    photo = await getSchoolPhotoById(schoolPhotoId);
  } catch (error) {
    notFound();
  }

  if (!photo) {
    notFound();
  }

  const image = photo.photo as Media;
  const imageUrl = image?.url;
  const school =
    typeof photo.schoolDetails?.school === "object"
      ? (photo.schoolDetails.school as School)
      : null;
  const photoClass =
    typeof photo.schoolDetails?.class === "object"
      ? (photo.schoolDetails.class as Class)
      : null;

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:pl-0">
          <Link
            href="/dashboard/school-photos"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to School Photos
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden p-0">
            <CardContent className="p-0">
              <div className="relative aspect-4/3 flex items-center justify-center">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={photo.name || "School Photo"}
                    fill
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="text-muted-foreground">
                    No Image Available
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{photo.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Details
                </h3>
                <div className="space-y-2">
                  {photo.photoType && (
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm">Type</span>
                      <Badge >{photo.photoType}</Badge>
                    </div>
                  )}
                  {photo.studentName && (
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm">Student Name</span>
                      <span className="text-sm font-medium">
                        {photo.studentName}
                      </span>
                    </div>
                  )}
                  {school && (
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm">School</span>
                      <span className="text-sm font-medium">{school.name}</span>
                    </div>
                  )}
                  {photoClass && (
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-sm">Class</span>
                      <span className="text-sm font-medium">
                        {photoClass.name}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {imageUrl && (
                <Button className="w-full" asChild>
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download Original
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SchoolPhotoDetails;
