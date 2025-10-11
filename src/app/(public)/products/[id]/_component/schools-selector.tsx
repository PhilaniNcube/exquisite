"use client";

import { Class, School } from "@/payload-types";
import { useQueryState } from "nuqs";
import React, { useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SchoolWithClasses extends School {
  classes: Class[];
}

interface SchoolsSelectorProps {
  schoolsWithClasses: { docs: SchoolWithClasses[] };
}

const SchoolsSelector = ({ schoolsWithClasses }: SchoolsSelectorProps) => {
  const [schoolId, setSchoolId] = useQueryState("schoolId", {
    defaultValue: "",
  });
  const [classId, setClassId] = useQueryState("classId", {
    defaultValue: "",
  });

  // Get all classes from all schools
  const allClasses = useMemo(
    () =>
      schoolsWithClasses.docs.flatMap(
        (school) =>
          school.classes?.map((classItem) => ({
            ...classItem,
            schoolName: school.name,
          })) || []
      ),
    [schoolsWithClasses]
  );

  // Filter classes based on selected school
  const filteredClasses = useMemo(() => {
    if (!schoolId) return allClasses;

    const selectedSchool = schoolsWithClasses.docs.find(
      (school) => school.id.toString() === schoolId
    );
    return (
      selectedSchool?.classes?.map((classItem) => ({
        ...classItem,
        schoolName: selectedSchool.name,
      })) || []
    );
  }, [schoolId, schoolsWithClasses, allClasses]);

  const handleSchoolChange = (value: string) => {
    setSchoolId(value || null);
    // Reset class selection when school changes
    if (classId) {
      setClassId(null);
    }
  };

  const handleClassChange = (value: string) => {
    setClassId(value || null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="school-select">Select School:</Label>
        <Select value={schoolId || ""} onValueChange={handleSchoolChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Schools" />
          </SelectTrigger>
          <SelectContent>
            {schoolsWithClasses.docs?.map((school) => (
              <SelectItem key={school.id} value={school.id.toString()}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col space-y-2">
        <Label htmlFor="class-select">Select Class:</Label>
        <Select value={classId || ""} onValueChange={handleClassChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Classes" />
          </SelectTrigger>
          <SelectContent>
            {filteredClasses?.map((classItem) => (
              <SelectItem key={classItem.id} value={classItem.id.toString()}>
                {classItem.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SchoolsSelector;
