"use client";

import { SchoolPhoto, Class } from "@/payload-types";
import Image from "next/image";
import { Card, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera } from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import PhotoFilters from "./photo-filters";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the responsive column count based on the current viewport width. */
function useColumnCount() {
  const [cols, setCols] = useState(4);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCols(2);
      else if (window.innerWidth < 1024) setCols(3);
      else setCols(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return cols;
}

interface ItemRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

/**
 * Computes absolute positions for a masonry layout using a greedy
 * shortest-column-first algorithm.
 *
 * Because Payload stores pixel dimensions on every media document we can
 * derive each image's rendered height from its aspect ratio and the known
 * column width — no DOM measurement required.
 *
 * The shortest-column-first rule naturally produces left-to-right reading
 * order: when all columns are tied (e.g. at the start) `indexOf(min)`
 * always picks the leftmost one, so items flow 0→1→2→3 across the first
 * row before wrapping to the second row.
 */
function computeMasonryLayout(
  photos: SchoolPhoto[],
  containerWidth: number,
  columnCount: number,
  gap: number
): ItemRect[] {
  const colWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;
  const columnHeights = new Array<number>(columnCount).fill(0);

  return photos.map((photo) => {
    // Find the shortest (leftmost when tied) column.
    const min = Math.min(...columnHeights);
    const col = columnHeights.indexOf(min);

    // Derive rendered height from the stored aspect ratio.
    const srcW =
      (typeof photo.photo === "object" && photo.photo?.width) || 400;
    const srcH =
      (typeof photo.photo === "object" && photo.photo?.height) || 600;
    const renderedHeight = colWidth * (srcH / srcW);

    const rect: ItemRect = {
      top: columnHeights[col],
      left: col * (colWidth + gap),
      width: colWidth,
      height: renderedHeight,
    };

    columnHeights[col] += renderedHeight + gap;
    return rect;
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface SchoolPhotosGalleryProps {
  photos: SchoolPhoto[];
  classes: Class[];
  schoolName: string;
  totalPages?: number;
  currentPage?: number;
}

const GAP = 16; // px — matches gap-4 (1rem)

const SchoolPhotosGallery = ({
  photos,
  classes,
  schoolName,
  totalPages,
  currentPage,
}: SchoolPhotosGalleryProps) => {
  const [filters, setFilters] = useState({
    class: "",
    studentName: "",
    photoType: "",
  });

  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      if (
        filters.class &&
        photo.schoolDetails &&
        typeof photo.schoolDetails.class === "object" &&
        photo.schoolDetails.class?.id !== parseInt(filters.class)
      ) {
        return false;
      }
      if (filters.photoType && photo.photoType !== filters.photoType) {
        return false;
      }
      return true;
    });
  }, [photos, filters]);

  // Track the container width with a ResizeObserver so the layout
  // recalculates whenever the container resizes (window resize, sidebar open…).
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const columnCount = useColumnCount();

  const positions = useMemo(() => {
    if (containerWidth === 0) return [] as ItemRect[];
    return computeMasonryLayout(filteredPhotos, containerWidth, columnCount, GAP);
  }, [filteredPhotos, containerWidth, columnCount]);

  // Container height = the bottom edge of the tallest column.
  const containerHeight = useMemo(() => {
    if (positions.length === 0) return 0;
    return Math.max(...positions.map((p) => p.top + p.height));
  }, [positions]);

  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-gray-600 mb-2">
          No Photos Yet
        </h3>
        <p className="text-gray-500">
          Photos from {schoolName} will appear here once they&apos;re
          available.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">School Photos</h2>
        <p className="text-gray-600">
          Browse through our photography collection from {schoolName}
        </p>
      </div>

      <PhotoFilters
        photos={photos}
        classes={classes}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {filteredPhotos.length === 0 ? (
        <div className="text-center py-16">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-600 mb-2">
            No Photos Found
          </h3>
          <p className="text-gray-500">
            Try adjusting your filters to see more photos.
          </p>
        </div>
      ) : (
        /**
         * Absolutely-positioned masonry.
         *
         * Items are placed by the greedy shortest-column algorithm which
         * fills left-to-right (leftmost column wins when heights are equal).
         * The container height is set explicitly so it wraps the tallest column.
         *
         * On the very first render `containerWidth` is 0 so `positions` is
         * empty; the ref fires on mount and triggers a re-render with the
         * real width, so the flash is imperceptible.
         */
        <div
          ref={containerRef}
          className="relative w-full"
          style={{ height: containerHeight || undefined }}
        >
          {filteredPhotos.map((photo, i) => {
            const pos = positions[i];
            return (
              <div
                key={photo.id}
                className={pos ? "absolute" : "hidden"}
                style={
                  pos
                    ? {
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                      }
                    : undefined
                }
              >
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 relative p-0 cursor-pointer">
                  <Link
                    href={`/school-photos/${photo.id}`}
                    className="relative overflow-hidden block"
                  >
                    <CardTitle className="sr-only">
                      {photo.name || "School Photo"}
                    </CardTitle>
                    {photo.photo && typeof photo.photo === "object" && (
                      <Image
                        src={
                          photo.photo.sizes?.thumbnail?.url ||
                          photo.photo.url ||
                          ""
                        }
                        alt={photo.photo.alt || "School photo"}
                        width={
                          photo.photo.sizes?.thumbnail?.width ||
                          photo.photo.width ||
                          400
                        }
                        height={
                          photo.photo.sizes?.thumbnail?.height ||
                          photo.photo.height ||
                          600
                        }
                        style={{ width: "100%", height: "auto" }}
                        className="group-hover:scale-105 transition-transform duration-300"
                      />
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Photo details overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <div className="flex flex-wrap gap-2">
                        {photo.schoolDetails &&
                          typeof photo.schoolDetails.class === "object" &&
                          photo.schoolDetails.class && (
                            <Badge
                              variant="secondary"
                              className="text-xs bg-white/20 text-white border-white/30 hover:bg-white/30"
                            >
                              {photo.schoolDetails.class.name}
                            </Badge>
                          )}
                      </div>
                    </div>
                  </Link>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      {totalPages && totalPages > 1 && (
        <div className="mt-12">
          <Pagination>
            <PaginationContent>
              {currentPage && currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious href={createPageURL(currentPage - 1)} />
                </PaginationItem>
              )}

              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;

                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (currentPage && Math.abs(pageNum - currentPage) <= 1)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        href={createPageURL(pageNum)}
                        isActive={currentPage === pageNum}
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }

                if (
                  (currentPage && pageNum === currentPage - 2) ||
                  (currentPage && pageNum === currentPage + 2)
                ) {
                  return (
                    <PaginationItem key={pageNum}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                return null;
              })}

              {currentPage && currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext href={createPageURL(currentPage + 1)} />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default SchoolPhotosGallery;
