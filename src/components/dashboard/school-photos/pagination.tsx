import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Route } from 'next'

interface PaginationProps {
  page: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  prevPage?: number | null
  nextPage?: number | null
  searchParams: { [key: string]: string | string[] | undefined }
  baseUrl: string
}

export function Pagination({
  page,
  totalPages,
  hasPrevPage,
  hasNextPage,
  prevPage,
  nextPage,
  searchParams,
  baseUrl,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const createQueryString = (newPage: number) => {
    const params = new URLSearchParams()
    
    // Copy existing params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== 'page' && value) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v))
        } else {
          params.append(key, value)
        }
      }
    })
    
    // Set new page
    params.set('page', newPage.toString())
    
    return params.toString()
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <Button
        variant="outline"
        size="icon"
        disabled={!hasPrevPage}
        asChild={hasPrevPage}
      >
        {hasPrevPage && prevPage ? (
          <Link href={`${baseUrl}?${createQueryString(prevPage)}` as Route}>
            <ChevronLeft className="h-4 w-4" />
          </Link>
        ) : (
          <span className="cursor-not-allowed opacity-50">
            <ChevronLeft className="h-4 w-4" />
          </span>
        )}
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        disabled={!hasNextPage}
        asChild={hasNextPage}
      >
        {hasNextPage && nextPage ? (
          <Link href={`${baseUrl}?${createQueryString(nextPage)}` as Route}>
            <ChevronRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="cursor-not-allowed opacity-50">
            <ChevronRight className="h-4 w-4" />
          </span>
        )}
      </Button>
    </div>
  )
}
