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
import { useQueryState, parseAsInteger } from "nuqs"
import { Order } from "@/payload-types"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Route } from "next"
import { formatPrice } from "@/lib/utils"

interface OrdersTableProps {
  orders: Order[]
  totalPages: number
}

export function OrdersTable({ orders, totalPages }: OrdersTableProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1))
  const router = useRouter()

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow 
                key={order.id}
                className="cursor-pointer"
                onClick={() => router.push(`/dashboard/orders/${order.id}` as Route)}
              >
                <TableCell>{order.id}</TableCell>
                <TableCell>
                  {typeof order.customerDetails.customer === 'object' && order.customerDetails.customer !== null
                    ? `${order.customerDetails.customer.firstName} ${order.customerDetails.customer.lastName}`
                    : order.customerDetails.customer}
                </TableCell>
                <TableCell>
                  <span className="capitalize">{order.orderStatus}</span>
                </TableCell>
                <TableCell>{order.orderTotal ? formatPrice(order.orderTotal) : "-"}</TableCell>
                <TableCell>{format(new Date(order.createdAt), "PP")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
