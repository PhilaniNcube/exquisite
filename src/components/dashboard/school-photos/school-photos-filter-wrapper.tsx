import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SchoolPhotosFilter } from './school-photos-filter'

export async function SchoolPhotosFilterWrapper() {
  const payload = await getPayload({ config: configPromise })

  // Fetch schools and classes for the filter
  const schoolsResult = await payload.find({
    collection: 'schools',
    pagination: false,
    sort: 'name',
  })

  const classesResult = await payload.find({
    collection: 'classes',
    pagination: false,
    sort: 'name',
  })

  return (
    <SchoolPhotosFilter 
      schools={schoolsResult.docs} 
      classes={classesResult.docs} 
    />
  )
}
