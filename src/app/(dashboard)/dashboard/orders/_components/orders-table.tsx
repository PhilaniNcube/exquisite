"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQueryState, parseAsInteger, parseAsString } from "nuqs"
import { Order, School, Class as PayloadClass, Product, SchoolPhoto, Media } from "@/payload-types"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Route } from "next"
import { formatPrice } from "@/lib/utils"
import { DeleteOrderButton } from "@/components/dashboard/orders/delete-order-button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useMemo } from "react"

interface OrdersTableProps {
  orders: Order[]
  totalPages: number
  canDeleteOrders: boolean
  schools: School[]
  classes: PayloadClass[]
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800"
    case "processing": return "bg-blue-100 text-blue-800"
    case "cancelled": return "bg-red-100 text-red-800"
    default: return "bg-yellow-100 text-yellow-800"
  }
}

function extractOrderSchoolInfo(order: Order) {
  const schools = new Map<number, string>()
  const classes = new Map<number, string>()

  for (const item of order.productDetails.orderItems) {
    const picture = item.picture
    if (typeof picture === "object" && picture !== null) {
      const photo = picture as SchoolPhoto
      const school = photo.schoolDetails?.school
      if (typeof school === "object" && school !== null) {
        schools.set(school.id, school.name)
      }
      const cls = photo.schoolDetails?.class
      if (typeof cls === "object" && cls !== null) {
        classes.set(cls.id, cls.name)
      }
    }
  }

  return {
    schools: Array.from(schools.entries()),
    classes: Array.from(classes.entries()),
  }
}

function orderMatchesFilters(
  order: Order,
  schoolFilter: string | null,
  classFilter: string | null
): boolean {
  if (!schoolFilter && !classFilter) return true

  for (const item of order.productDetails.orderItems) {
    const picture = item.picture
    if (typeof picture !== "object" || picture === null) continue
    const photo = picture as SchoolPhoto

    const school = photo.schoolDetails?.school
    const schoolId = typeof school === "object" && school !== null ? school.id : typeof school === "number" ? school : null
    const cls = photo.schoolDetails?.class
    const classId = typeof cls === "object" && cls !== null ? cls.id : typeof cls === "number" ? cls : null

    const schoolMatch = !schoolFilter || schoolId === Number(schoolFilter)
    const classMatch = !classFilter || classId === Number(classFilter)

    if (schoolMatch && classMatch) return true
  }

  return false
}

export function OrdersTable({ orders, totalPages, canDeleteOrders, schools, classes }: OrdersTableProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const [schoolFilter, setSchoolFilter] = useQueryState("school", parseAsString.withDefault(""))
  const [classFilter, setClassFilter] = useQueryState("class", parseAsString.withDefault(""))
  const router = useRouter()

  const filteredClasses = useMemo(() => {
    if (!schoolFilter) return classes
    return classes.filter((cls) => {
      const schoolId = typeof cls.school === "object" ? cls.school?.id : cls.school
      return schoolId === Number(schoolFilter)
    })
  }, [classes, schoolFilter])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      orderMatchesFilters(order, schoolFilter || null, classFilter || null)
    )
  }, [orders, schoolFilter, classFilter])

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Filter by School</label>
          <Select
            value={schoolFilter}
            onValueChange={(val) => {
              setSchoolFilter(val === "all" ? "" : val)
              setClassFilter("")
            }}
          >
            <SelectTrigger className="w-55">
              <SelectValue placeholder="All Schools" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schools</SelectItem>
              {schools.map((school) => (
                <SelectItem key={school.id} value={String(school.id)}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Filter by Class</label>
          <Select
            value={classFilter}
            onValueChange={(val) => setClassFilter(val === "all" ? "" : val)}
          >
            <SelectTrigger className="w-55">
              <SelectValue placeholder="All Classes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {filteredClasses.map((cls) => (
                <SelectItem key={cls.id} value={String(cls.id)}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {(schoolFilter || classFilter) && (
          <button
            className="text-sm text-muted-foreground underline hover:text-foreground pb-1"
            onClick={() => {
              setSchoolFilter("")
              setClassFilter("")
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No orders match the selected filters.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const info = extractOrderSchoolInfo(order)
            const customer =
              typeof order.customerDetails.customer === "object" && order.customerDetails.customer !== null
                ? order.customerDetails.customer
                : null

            return (
              <div
                key={order.id}
                className="rounded-lg border bg-card cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => router.push(`/dashboard/orders/${order.id}` as Route)}
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b">
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-sm">Order #{order.id}</span>
                    <Badge className={getStatusColor(order.orderStatus ?? "pending")} variant="outline">
                      {order.orderStatus ?? "pending"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), "PPp")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold">
                      {order.orderTotal ? formatPrice(order.orderTotal) : "-"}
                    </span>
                    {canDeleteOrders && (
                      <div onClick={(e) => e.stopPropagation()}>
                        <DeleteOrderButton orderId={order.id} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer & School Info */}
                <div className="px-4 py-2 border-b flex flex-wrap gap-x-6 gap-y-1 text-sm">
                  {customer && (
                    <span>
                      <span className="text-muted-foreground">Customer:</span>{" "}
                      {customer.firstName} {customer.lastName}
                    </span>
                  )}
                  {info.schools.length > 0 && (
                    <span>
                      <span className="text-muted-foreground">School:</span>{" "}
                      {info.schools.map(([, name]) => name).join(", ")}
                    </span>
                  )}
                  {info.classes.length > 0 && (
                    <span>
                      <span className="text-muted-foreground">Class:</span>{" "}
                      {info.classes.map(([, name]) => name).join(", ")}
                    </span>
                  )}
                </div>

                {/* Line Items */}
                <div className="p-4">
                  <div className="grid gap-3">
                    {order.productDetails.orderItems.map((item, idx) => {
                      const product = typeof item.product === "object" ? (item.product as Product) : null
                      const picture = typeof item.picture === "object" ? (item.picture as SchoolPhoto) : null
                      const productImage = product && typeof product.image === "object" ? (product.image as Media) : null
                      const schoolPhotoMedia = picture && typeof picture.photo === "object" ? (picture.photo as Media) : null

                      return (
                        <div key={item.id ?? idx} className="flex items-center gap-3 text-sm">
                          {/* School Photo Thumbnail */}
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-muted shrink-0">
                            {schoolPhotoMedia?.sizes?.thumbnail?.url ? (
                              <Image
                                src={schoolPhotoMedia.sizes.thumbnail.url}
                                alt={picture?.name ?? "School photo"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                Photo
                              </div>
                            )}
                          </div>

                          {/* Product Image Thumbnail */}
                          <div className="relative w-12 h-12 rounded overflow-hidden bg-muted shrink-0">
                            {productImage?.sizes?.thumbnail?.url ? (
                              <Image
                                src={productImage.sizes.thumbnail.url}
                                alt={product?.title ?? "Product"}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-muted-foreground">
                                Product
                              </div>
                            )}
                          </div>

                          {/* Item Details */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {product?.title ?? `Product #${typeof item.product === "number" ? item.product : "?"}`}
                            </p>
                            <p className="text-muted-foreground truncate">
                              {picture?.name ?? "Unknown photo"}
                              {picture?.photoType && (
                                <span className="ml-1 text-xs">({picture.photoType})</span>
                              )}
                            </p>
                          </div>

                          {/* Qty & Price */}
                          <div className="text-right shrink-0">
                            <p>{formatPrice(item.priceAtPurchase)} × {item.quantity}</p>
                            <p className="font-medium">{formatPrice(item.linePrice)}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
      
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                if (page > 1) setPage(page - 1)
              }} 
              aria-disabled={page <= 1}
              className={page <= 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          
          <PaginationItem>
             <span className="px-4 text-sm">Page {page} of {totalPages}</span>
          </PaginationItem>

          <PaginationItem>
            <PaginationNext 
              href="#" 
              onClick={(e) => {
                e.preventDefault()
                if (page < totalPages) setPage(page + 1)
              }}
              aria-disabled={page >= totalPages}
              className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
