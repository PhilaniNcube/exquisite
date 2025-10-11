"use client";

import { Class, SchoolPhoto } from "@/payload-types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface PhotoFiltersProps {
  photos: SchoolPhoto[];
  classes: Class[];
  filters: {
    class: string;
    studentName: string;
    photoType: string;
  };
  onFiltersChange: (filters: { class: string; studentName: string; photoType: string }) => void;
}

const PhotoFilters = ({ photos, classes, filters, onFiltersChange }: PhotoFiltersProps) => {
  // Get unique photo types from the photos
  const photoTypes = Array.from(new Set(photos.map(photo => photo.photoType).filter(Boolean)));
  
  // Get unique student names from the photos
  const studentNames = Array.from(new Set(
    photos.flatMap(photo => 
      Array.isArray(photo.studentName) ? photo.studentName : []
    ).filter(Boolean)
  ));

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      class: '',
      studentName: '',
      photoType: '',
    });
  };

  const hasActiveFilters = filters.class || filters.studentName || filters.photoType;

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
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Class
            </label>
            <Select value={filters.class} onValueChange={(value) => handleFilterChange('class', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All classes" />
              </SelectTrigger>
              <SelectContent>
           
                {classes.map((classItem) => (
                  <SelectItem key={classItem.id} value={classItem.id.toString()}>
                    {classItem.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Name
            </label>
            <Select value={filters.studentName} onValueChange={(value) => handleFilterChange('studentName', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All students" />
              </SelectTrigger>
              <SelectContent>
                {studentNames.length === 0 && (
                    <SelectItem value="all">No students available</SelectItem>
                )}
                {studentNames.map((name) => (
                  <SelectItem key={name} value={name}>
                    {name}
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
            <Select value={filters.photoType} onValueChange={(value) => handleFilterChange('photoType', value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
              
                {photoTypes.map((type) => (
                  <SelectItem key={type} value={type!}>
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
