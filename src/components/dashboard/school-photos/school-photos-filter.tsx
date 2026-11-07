'use client'

import React from 'react'
import { useQueryState, parseAsString } from 'nuqs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Class, School } from '@/payload-types'
import { PhotoSearchInput } from '@/components/dashboard/photos/photo-search-input'
import { PhotoSortSelect } from '@/components/dashboard/photos/photo-sort-select'

interface SchoolPhotosFilterProps {
  schools: School[]
  classes: Class[]
}

export function SchoolPhotosFilter({ schools, classes }: SchoolPhotosFilterProps) {
  const [schoolId, setSchoolId] = useQueryState(
    'school',
    parseAsString.withOptions({ shallow: false })
  )
  const [classId, setClassId] = useQueryState(
    'class',
    parseAsString.withOptions({ shallow: false })
  )
  const [search, setSearch] = useQueryState(
    'q',
    parseAsString.withOptions({ shallow: false })
  )
  const [, setPage] = useQueryState(
    'page',
    parseAsString.withOptions({ shallow: false })
  )

  const handleSchoolChange = (value: string) => {
    setSchoolId(value)
    setClassId(null) // Reset class when school changes
    setPage(null)
  }

  const handleClassChange = (value: string) => {
    setClassId(value)
    setPage(null)
  }

  const clearFilters = () => {
    setSchoolId(null)
    setClassId(null)
    setSearch(null)
    setPage(null)
  }

  // Filter classes based on selected school
  const filteredClasses = schoolId
    ? classes.filter((c) => {
        const sId = parseInt(schoolId)
        return typeof c.school === 'object' ? c.school?.id === sId : c.school === sId
      })
    : []

  const hasFilters = Boolean(schoolId || classId || search)

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 items-end">
      <PhotoSearchInput
        className="w-full sm:w-[240px]"
        placeholder="Search by name or ID..."
      />

      <div className="w-full sm:w-[200px]">
        <label className="text-sm font-medium mb-2 block">School</label>
        <Select value={schoolId || ''} onValueChange={handleSchoolChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select School" />
          </SelectTrigger>
          <SelectContent>
            {schools.map((school) => (
              <SelectItem key={school.id} value={school.id.toString()}>
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full sm:w-[200px]">
        <label className="text-sm font-medium mb-2 block">Class</label>
        <Select
          value={classId || ''}
          onValueChange={handleClassChange}
          disabled={!schoolId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Class" />
          </SelectTrigger>
          <SelectContent>
            {filteredClasses.map((cls) => (
              <SelectItem key={cls.id} value={cls.id.toString()}>
                {cls.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <PhotoSortSelect
        className="w-full sm:w-[200px]"
        label="Sort by name"
      />

      {hasFilters && (
        <Button variant="ghost" onClick={clearFilters} className="mb-0.5">
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
