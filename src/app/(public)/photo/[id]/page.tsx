import React from "react";
import Link from "next/link";
import { Suspense } from "react";
import PhotoDisplay from "./photo-display";

const PhotoContent = async ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = await params;
  return <PhotoDisplay id={id} />;
}

const PhotoPage = ({ params }: { params: Promise<{ id: number }> }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <Link
        href="/portfolio"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        ← Back to Portfolio
      </Link>

      <Suspense fallback={<div>Loading photo...</div>}>
        <PhotoContent params={params} />
      </Suspense>
    </div>
  );
};

export default PhotoPage;
