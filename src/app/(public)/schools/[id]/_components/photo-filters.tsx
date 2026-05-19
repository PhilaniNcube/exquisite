"use client";

import { Class, SchoolPhoto } from "@/payload-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryState, parseAsString } from "nuqs";

interface PhotoFiltersProps {
  classes: Class[];
}

const PhotoFilters = ({ classes }: PhotoFiltersProps) => {
  const [classFilter, setClassFilter] = useQueryState(
    "class",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );
  
  const [photoTypeFilter, setPhotoTypeFilter] = useQueryState(
    "photoType",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );
  
  const [, setPage] = useQueryState(
    "page",
    parseAsString.withDefault("").withOptions({ shallow: false })
  );

  const photoTypes = ["Individual", "Class", "Sports", "Group"];

  const handleClassChange = (value: string) => {
    setClassFilter(value === "all_classes" ? null : value);
    setPage(null); // Reset pagination to first page
  };

  const handlePhotoTypeChange = (value: string) => {
    setPhotoTypeFilter(value === "all_types" ? null : value);
    setPage(null); // Reset pagination to first page
  };

  const clearFilters = () => {
    setClassFilter(null);
    setPhotoTypeFilter(null);
    setPage(null);
  };

  const hasActiveFilters = classFilter || photoTypeFilter;

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Filter Photos</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>
            <Select value={classFilter || "all_classes"} onValueChange={handleClassChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_classes">All classes</SelectItem>
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id.toString()}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Photo Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo Type
            </label>
            <Select value={photoTypeFilter || "all_types"} onValueChange={handlePhotoTypeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_types">All types</SelectItem>
                {photoTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoFilters;
