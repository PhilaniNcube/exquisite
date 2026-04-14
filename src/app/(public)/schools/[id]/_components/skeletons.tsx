const SchoolHeaderSkeleton = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white animate-pulse">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <div className="h-12 w-64 bg-white/20 rounded-lg mx-auto mb-6"></div>
        </div>
      </div>
    </div>
  );
};

const SchoolGallerySkeleton = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-5 w-72 bg-gray-200 rounded"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
        ))}
      </div>
    </div>
  );
};

const SchoolPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <SchoolHeaderSkeleton />
      <SchoolGallerySkeleton />
    </div>
  );
};

export { SchoolHeaderSkeleton, SchoolGallerySkeleton, SchoolPageSkeleton };
