"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Order, School, Class as PayloadClass, Customer, SchoolPhoto, Product } from "@/payload-types"
import { getFilteredOrdersForPrint } from "../actions"
import { format } from "date-fns"
import { formatPrice } from "@/lib/utils"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

interface PrintPdfButtonProps {
  currentOrders: Order[]
  schoolFilter: string | null
  classFilter: string | null
  paidOnly: boolean
  schools: School[]
  classes: PayloadClass[]
}

function extractCustomerInfo(order: Order) {
  const customerRel = order.customerDetails?.customer
  const isSignedIn = typeof customerRel === "object" && customerRel !== null
  const customer = isSignedIn ? (customerRel as Customer) : null

  return {
    name: customer
      ? [customer.firstName, customer.lastName].filter(Boolean).join(" ") || "—"
      : order.customerDetails?.studentName || "—",
    email: customer
      ? customer.email
      : order.customerDetails?.email || "—",
    phone: order.customerDetails?.cellNumber || "—",
  }
}

function extractOrderSchoolInfo(order: Order) {
  const schools = new Map<number, string>()
  const classes = new Map<number, string>()

  if (order.productDetails?.orderItems) {
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
  }

  return {
    schools: Array.from(schools.entries()),
    classes: Array.from(classes.entries()),
  }
}

export function PrintPdfButton({
  currentOrders,
  schoolFilter,
  classFilter,
  paidOnly,
  schools,
  classes,
}: PrintPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const generatePDF = (ordersData: Order[], titleSuffix: string) => {
    const doc = new jsPDF()

    // Title and Header
    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.setTextColor(41, 128, 185) // Slate blue
    doc.text("EXQUISITE PHOTOGRAPHY", 14, 22)

    doc.setFontSize(12)
    doc.setTextColor(100, 100, 100)
    doc.text(`ORDERS REPORT - ${titleSuffix.toUpperCase()}`, 14, 30)

    // Metadata
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    let yPos = 38
    doc.text(`Generated on: ${format(new Date(), "PPpp")}`, 14, yPos)
    yPos += 6

    let filterText = "Filters: None"
    if (schoolFilter || classFilter || paidOnly) {
      const parts = []
      if (schoolFilter) {
        const schoolName = schools.find((s) => String(s.id) === schoolFilter)?.name || schoolFilter
        parts.push(`School: ${schoolName}`)
      }
      if (classFilter) {
        const className = classes.find((c) => String(c.id) === classFilter)?.name || classFilter
        parts.push(`Class: ${className}`)
      }
      if (paidOnly) {
        parts.push("Paid Only")
      }
      filterText = `Filters: ${parts.join(" | ")}`
    }
    doc.text(filterText, 14, yPos)
    yPos += 6

    const totalOrders = ordersData.length
    const totalRevenue = ordersData.reduce((acc, o) => acc + (o.orderTotal || 0), 0)
    
    doc.setFont("helvetica", "bold")
    doc.text(`Total Orders: ${totalOrders}`, 14, yPos)
    doc.text(`Total Revenue: ${formatPrice(totalRevenue)}`, 80, yPos)
    
    // Table Data
    const tableBody = ordersData.map((order) => {
      const customerInfo = extractCustomerInfo(order)
      const schoolInfo = extractOrderSchoolInfo(order)
      const schoolsStr = schoolInfo.schools.map(([, n]) => n).join(", ")
      const classesStr = schoolInfo.classes.map(([, n]) => n).join(", ")
      
      const itemsStr = order.productDetails?.orderItems?.map(item => {
        const product = typeof item.product === "object" ? (item.product as Product) : null
        const picture = typeof item.picture === "object" ? (item.picture as SchoolPhoto) : null
        const prodName = product?.title || "Product"
        const picName = picture?.name || "Photo"
        return `${item.quantity}x ${prodName} (${picName})`
      }).join("\n") || ""

      return [
        order.id,
        format(new Date(order.createdAt), "dd MMM yyyy"),
        `${order.customerDetails?.studentName || "—"}\n${customerInfo.email}\n${customerInfo.phone}`,
        `S: ${schoolsStr || "-"}\nC: ${classesStr || "-"}`,
        itemsStr,
        order.orderTotal ? formatPrice(order.orderTotal) : "-",
        (order.orderStatus === "printed" ? "PRINTED & DELIVERED" : (order.orderStatus || "pending").toUpperCase())
      ]
    })

    autoTable(doc, {
      startY: yPos + 6,
      head: [["ID", "Date", "Customer", "School & Class", "Items", "Total", "Status"]],
      body: tableBody,
      theme: "striped",
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
      columnStyles: {
        0: { cellWidth: 15 },
        1: { cellWidth: 20 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
        4: { cellWidth: 50 },
        5: { cellWidth: 20 },
        6: { cellWidth: 20 },
      },
    })

    doc.save(`exquisite-orders-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`)
  }

  const handlePrintCurrentPage = () => {
    setIsGenerating(true)
    setTimeout(() => {
      generatePDF(currentOrders, "Current Page")
      setIsGenerating(false)
    }, 100)
  }

  const handlePrintAllFiltered = async () => {
    try {
      setIsGenerating(true)
      const allOrders = await getFilteredOrdersForPrint(schoolFilter || undefined, classFilter || undefined, paidOnly || undefined)
      generatePDF(allOrders, "Filtered List")
    } catch (error) {
      console.error("Failed to fetch all orders for PDF", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 shrink-0" disabled={isGenerating}>
          {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
          Export PDF
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handlePrintCurrentPage}>
          Print Current Page ({currentOrders.length})
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handlePrintAllFiltered}>
          Print All Filtered
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
