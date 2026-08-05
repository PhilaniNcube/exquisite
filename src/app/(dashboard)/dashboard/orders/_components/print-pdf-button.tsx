"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Printer, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
  dateFilter?: string | null
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

// ──────────────────────────────────────────────────────────────
// Types for Packing Slip grouping
// ──────────────────────────────────────────────────────────────

interface PackingSlipLineItem {
  photoName: string
  photoType: string
  productName: string
  quantity: number
  linePrice: number
  orderId: number
  customerName: string
  customerEmail: string
  customerPhone: string
  childName: string
}

interface StudentGroup {
  childName: string
  items: PackingSlipLineItem[]
  orderIds: Set<number>
}

interface ClassGroup {
  classId: number | null
  className: string
  students: Map<string, StudentGroup>
}

interface SchoolGroup {
  schoolId: number | null
  schoolName: string
  classes: Map<string, ClassGroup>
}

// ──────────────────────────────────────────────────────────────
// Grouping logic: Order[] → School → Class → Student
// ──────────────────────────────────────────────────────────────

function buildPackingSlipGroups(
  orders: Order[],
  classesLookup: PayloadClass[]
): { schoolGroups: Map<string, SchoolGroup>; allOrders: Map<number, { customerName: string; customerEmail: string; customerPhone: string; total: number; childrenClasses: string[] }> } {
  const schoolGroups = new Map<string, SchoolGroup>()
  const allOrders = new Map<number, { customerName: string; customerEmail: string; customerPhone: string; total: number; childrenClasses: string[] }>()

  for (const order of orders) {
    const customerInfo = extractCustomerInfo(order)

    if (!allOrders.has(order.id)) {
      allOrders.set(order.id, {
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        total: order.orderTotal || 0,
        childrenClasses: [],
      })
    }

    if (!order.productDetails?.orderItems) continue

    for (const item of order.productDetails.orderItems) {
      const picture = typeof item.picture === "object" ? (item.picture as SchoolPhoto) : null
      const product = typeof item.product === "object" ? (item.product as Product) : null

      // Extract school info
      let schoolId: number | null = null
      let schoolName = "Unknown School"
      if (picture?.schoolDetails?.school) {
        const school = picture.schoolDetails.school
        if (typeof school === "object" && school !== null) {
          schoolId = school.id
          schoolName = school.name
        }
      }

      // Extract class info
      let classId: number | null = null
      let className = "Unclassified"
      if (picture?.schoolDetails?.class) {
        const cls = picture.schoolDetails.class
        if (typeof cls === "object" && cls !== null) {
          classId = cls.id
          className = cls.name
        } else if (typeof cls === "number") {
          classId = cls
          className = classesLookup.find((c) => c.id === cls)?.name || `Class #${cls}`
        }
      }

      // Child name: use per-item childName, fall back to order-level studentName
      const childName = item.childName || order.customerDetails?.studentName || "Unknown"

      const photoType = picture?.photoType || "Unknown"
      const photoName = picture?.name || "Photo"
      const productName = product?.title || "Product"

      const schoolKey = schoolId !== null ? String(schoolId) : "unknown"
      if (!schoolGroups.has(schoolKey)) {
        schoolGroups.set(schoolKey, {
          schoolId,
          schoolName,
          classes: new Map(),
        })
      }
      const schoolGroup = schoolGroups.get(schoolKey)!

      const classKey = classId !== null ? String(classId) : "unclassified"
      if (!schoolGroup.classes.has(classKey)) {
        schoolGroup.classes.set(classKey, {
          classId,
          className,
          students: new Map(),
        })
      }
      const classGroup = schoolGroup.classes.get(classKey)!

      const studentKey = childName.toLowerCase().trim()
      if (!classGroup.students.has(studentKey)) {
        classGroup.students.set(studentKey, {
          childName,
          items: [],
          orderIds: new Set(),
        })
      }
      const studentGroup = classGroup.students.get(studentKey)!

      studentGroup.items.push({
        photoName,
        photoType,
        productName,
        quantity: item.quantity,
        linePrice: item.linePrice,
        orderId: order.id,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        childName,
      })
      studentGroup.orderIds.add(order.id)

      // Track which children/classes this order spans
      const orderData = allOrders.get(order.id)!
      const childClassLabel = `${childName} (${className})`
      if (!orderData.childrenClasses.includes(childClassLabel)) {
        orderData.childrenClasses.push(childClassLabel)
      }
    }
  }

  return { schoolGroups, allOrders }
}

// ──────────────────────────────────────────────────────────────
// PDF Generation
// ──────────────────────────────────────────────────────────────

function generatePackingSlipPDF(
  ordersData: Order[],
  titleSuffix: string,
  schoolFilter: string | null,
  classFilter: string | null,
  paidOnly: boolean,
  dateFilter: string | null | undefined,
  schools: School[],
  classesLookup: PayloadClass[]
) {
  const doc = new jsPDF({ orientation: "landscape" })
  const pageWidth = doc.internal.pageSize.getWidth()

  const { schoolGroups, allOrders } = buildPackingSlipGroups(ordersData, classesLookup)

  // ── Header ──
  doc.setFont("helvetica", "bold")
  doc.setFontSize(18)
  doc.setTextColor(41, 128, 185)
  doc.text("EXQUISITE PHOTOGRAPHY", 14, 18)

  doc.setFontSize(13)
  doc.setTextColor(80, 80, 80)
  doc.text("PACKING SLIP", 14, 26)

  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.setTextColor(100, 100, 100)
  let yPos = 33
  doc.text(`Generated: ${format(new Date(), "PPpp")}`, 14, yPos)

  // Filter info
  const filterParts: string[] = []
  if (schoolFilter) {
    const schoolName = schools.find((s) => String(s.id) === schoolFilter)?.name || schoolFilter
    filterParts.push(`School: ${schoolName}`)
  }
  if (classFilter) {
    const className = classesLookup.find((c) => String(c.id) === classFilter)?.name || classFilter
    filterParts.push(`Class: ${className}`)
  }
  if (dateFilter) {
    const parsedDate = new Date(`${dateFilter}T00:00:00`)
    filterParts.push(`Date: ${!isNaN(parsedDate.getTime()) ? format(parsedDate, "PP") : dateFilter}`)
  }
  if (paidOnly) filterParts.push("Paid Only")
  if (filterParts.length > 0) {
    doc.text(`Filters: ${filterParts.join(" | ")}`, 120, yPos)
  }

  yPos += 5

  // Summary counts
  doc.setFont("helvetica", "bold")
  doc.setFontSize(10)
  doc.setTextColor(50, 50, 50)
  const totalOrders = allOrders.size
  const totalRevenue = Array.from(allOrders.values()).reduce((s, o) => s + o.total, 0)
  doc.text(`Total Orders: ${totalOrders}   |   Total Revenue: ${formatPrice(totalRevenue)}`, 14, yPos)
  yPos += 8

  // ── School → Class → Student sections ──
  for (const [, schoolGroup] of schoolGroups) {
    // Sort classes alphabetically
    const sortedClasses = Array.from(schoolGroup.classes.entries()).sort(
      ([, a], [, b]) => a.className.localeCompare(b.className)
    )

    for (const [, classGroup] of sortedClasses) {
      // Check if we need a new page (leave room for header + at least one row)
      if (yPos > doc.internal.pageSize.getHeight() - 50) {
        doc.addPage()
        yPos = 20
      }

      // Class header
      doc.setFillColor(41, 128, 185)
      doc.rect(14, yPos - 5, pageWidth - 28, 8, "F")
      doc.setFont("helvetica", "bold")
      doc.setFontSize(11)
      doc.setTextColor(255, 255, 255)
      doc.text(`${schoolGroup.schoolName}  ›  ${classGroup.className}`, 18, yPos)
      yPos += 8

      // Sort students alphabetically
      const sortedStudents = Array.from(classGroup.students.entries()).sort(
        ([, a], [, b]) => a.childName.localeCompare(b.childName)
      )

      let classItemCount = 0
      let classTotal = 0
      const classOrderIds = new Set<number>()
      const classStudentCount = sortedStudents.length

      for (const [, studentGroup] of sortedStudents) {
        // Student sub-table
        const studentTotal = studentGroup.items.reduce((s, i) => s + i.linePrice, 0)
        classTotal += studentTotal
        classItemCount += studentGroup.items.reduce((s, i) => s + i.quantity, 0)
        studentGroup.orderIds.forEach((id) => classOrderIds.add(id))

        const tableBody: any[] = []
        for (const lineItem of studentGroup.items) {
          tableBody.push([
            lineItem.photoName,
            lineItem.photoType,
            lineItem.productName,
            lineItem.quantity,
            formatPrice(lineItem.linePrice),
            `#${lineItem.orderId}`,
          ])
        }

        // Parent/order info line
        const parentInfo = studentGroup.items[0]
        const orderRefs = Array.from(studentGroup.orderIds).map((id) => `#${id}`).join(", ")

        autoTable(doc, {
          startY: yPos,
          head: [[
            { content: `✦ ${studentGroup.childName}`, colSpan: 4, styles: { fillColor: [236, 240, 241], textColor: [44, 62, 80], fontStyle: "bold", fontSize: 9 } },
            { content: formatPrice(studentTotal), styles: { fillColor: [236, 240, 241], textColor: [44, 62, 80], fontStyle: "bold", halign: "right", fontSize: 9 } },
            { content: `Order ${orderRefs}`, styles: { fillColor: [236, 240, 241], textColor: [100, 100, 100], fontStyle: "normal", fontSize: 8 } },
          ]],
          body: tableBody,
          foot: [[
            { content: `Parent: ${parentInfo.customerName} | ${parentInfo.customerPhone}`, colSpan: 6, styles: { fillColor: [249, 249, 249], textColor: [120, 120, 120], fontStyle: "italic", fontSize: 7.5 } },
          ]],
          theme: "plain",
          styles: { fontSize: 8, cellPadding: 2, lineColor: [220, 220, 220], lineWidth: 0.2 },
          columnStyles: {
            0: { cellWidth: 55 },
            1: { cellWidth: 25 },
            2: { cellWidth: 50 },
            3: { cellWidth: 15, halign: "center" },
            4: { cellWidth: 25, halign: "right" },
            5: { cellWidth: 30 },
          },
          margin: { left: 18, right: 18 },
          didDrawPage: () => {
            // Reset yPos on new pages
          },
        })

        yPos = (doc as any).lastAutoTable.finalY + 3
      }

      // Class subtotal bar
      if (yPos > doc.internal.pageSize.getHeight() - 20) {
        doc.addPage()
        yPos = 20
      }
      doc.setFillColor(245, 245, 245)
      doc.rect(14, yPos - 3, pageWidth - 28, 7, "F")
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8)
      doc.setTextColor(80, 80, 80)
      doc.text(
        `Class subtotal: ${formatPrice(classTotal)}  |  ${classItemCount} items  |  ${classStudentCount} students  |  ${classOrderIds.size} orders`,
        18,
        yPos + 1
      )
      yPos += 12
    }
  }

  // ── Order Reconciliation Table ──
  if (yPos > doc.internal.pageSize.getHeight() - 50) {
    doc.addPage()
    yPos = 20
  }

  doc.setFont("helvetica", "bold")
  doc.setFontSize(13)
  doc.setTextColor(41, 128, 185)
  doc.text("ORDER RECONCILIATION", 14, yPos)
  yPos += 6

  const reconBody: any[] = []
  let grandTotal = 0
  // Sort orders by ID
  const sortedOrders = Array.from(allOrders.entries()).sort(([a], [b]) => a - b)
  for (const [orderId, orderData] of sortedOrders) {
    grandTotal += orderData.total
    reconBody.push([
      `#${orderId}`,
      orderData.customerName,
      orderData.customerEmail,
      orderData.customerPhone,
      orderData.childrenClasses.join(", "),
      formatPrice(orderData.total),
    ])
  }

  autoTable(doc, {
    startY: yPos,
    head: [["Order #", "Parent", "Email", "Phone", "Children (Class)", "Total"]],
    body: reconBody,
    foot: [[
      { content: "", colSpan: 5 },
      { content: `Grand Total: ${formatPrice(grandTotal)}`, styles: { fontStyle: "bold", halign: "right" } },
    ]],
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 35 },
      2: { cellWidth: 45 },
      3: { cellWidth: 30 },
      4: { cellWidth: 80 },
      5: { cellWidth: 25, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  })

  doc.save(`exquisite-packing-slip-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`)
}

// ──────────────────────────────────────────────────────────────
// Standard Orders Report (existing behavior)
// ──────────────────────────────────────────────────────────────

function generateOrdersReportPDF(
  ordersData: Order[],
  titleSuffix: string,
  schoolFilter: string | null,
  classFilter: string | null,
  paidOnly: boolean,
  dateFilter: string | null | undefined,
  schools: School[],
  classes: PayloadClass[]
) {
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
  if (schoolFilter || classFilter || paidOnly || dateFilter) {
    const parts = []
    if (schoolFilter) {
      const schoolName = schools.find((s) => String(s.id) === schoolFilter)?.name || schoolFilter
      parts.push(`School: ${schoolName}`)
    }
    if (classFilter) {
      const className = classes.find((c) => String(c.id) === classFilter)?.name || classFilter
      parts.push(`Class: ${className}`)
    }
    if (dateFilter) {
      const parsedDate = new Date(`${dateFilter}T00:00:00`)
      parts.push(`Date: ${!isNaN(parsedDate.getTime()) ? format(parsedDate, "PP") : dateFilter}`)
    }
    if (paidOnly) {
      parts.push("Paid Only")
    }
    filterText = `Filters: ${parts.join(" | ")}`
  }
  doc.text(filterText, 14, yPos)
  yPos += 6

  const tableBody: any[] = []
  const totalOrdersCount = ordersData.length
  const totalRevenue = ordersData.reduce((acc, o) => acc + (o.orderTotal || 0), 0)

  ordersData.forEach((order) => {
    const customerInfo = extractCustomerInfo(order)
    const schoolInfo = extractOrderSchoolInfo(order)
    const schoolsStr = schoolInfo.schools.map(([, n]) => n).join(", ")
    const classesStr = schoolInfo.classes.map(([, n]) => n).join(", ")

    const itemsStr = (order.productDetails?.orderItems || []).map((item) => {
      const product = typeof item.product === "object" ? (item.product as Product) : null
      const picture = typeof item.picture === "object" ? (item.picture as SchoolPhoto) : null
      const prodName = product?.title || "Product"
      const picName = picture?.name || "Photo"

      const cls = picture?.schoolDetails?.class
      const className = typeof cls === "object" && cls !== null 
        ? cls.name 
        : typeof cls === "number" 
          ? classes.find(c => c.id === cls)?.name 
          : ""

      const classSuffix = className ? ` - Class: ${className}` : ""
      const childSuffix = item.childName ? ` [${item.childName}]` : ""
      return `${item.quantity}x ${prodName} (${picName}${classSuffix})${childSuffix}`
    }).join("\n") || ""

    tableBody.push([
      order.id,
      format(new Date(order.createdAt), "dd MMM yyyy"),
      `${customerInfo.name}\n${customerInfo.email}\n${customerInfo.phone}`,
      order.customerDetails?.studentName || "—",
      `S: ${schoolsStr || "-"}\nC: ${classesStr || "-"}`,
      itemsStr,
      order.orderTotal ? formatPrice(order.orderTotal) : "-",
      (order.orderStatus === "printed" ? "PRINTED & DELIVERED" : (order.orderStatus || "pending").toUpperCase())
    ])
  })

  doc.setFont("helvetica", "bold")
  doc.text(`Total Orders: ${totalOrdersCount}`, 14, yPos)
  doc.text(`Total Revenue: ${formatPrice(totalRevenue)}`, 80, yPos)

  autoTable(doc, {
    startY: yPos + 6,
    head: [["ID", "Date", "Customer", "Student Name", "School & Class", "Items", "Total", "Status"]],
    body: tableBody,
    theme: "striped",
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
    columnStyles: {
      0: { cellWidth: 12 },
      1: { cellWidth: 18 },
      2: { cellWidth: 35 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 45 },
      6: { cellWidth: 18 },
      7: { cellWidth: 18 },
    },
  })

  doc.save(`exquisite-orders-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`)
}

// ──────────────────────────────────────────────────────────────
// Component
// ──────────────────────────────────────────────────────────────

export function PrintPdfButton({
  currentOrders,
  schoolFilter,
  classFilter,
  paidOnly,
  dateFilter,
  schools,
  classes,
}: PrintPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handlePrintCurrentPage = () => {
    setIsGenerating(true)
    setTimeout(() => {
      generateOrdersReportPDF(currentOrders, "Current Page", schoolFilter, classFilter, paidOnly, dateFilter, schools, classes)
      setIsGenerating(false)
    }, 100)
  }

  const handlePrintAllFiltered = async () => {
    try {
      setIsGenerating(true)
      const allOrders = await getFilteredOrdersForPrint(schoolFilter || undefined, classFilter || undefined, paidOnly || undefined, dateFilter || undefined)
      generateOrdersReportPDF(allOrders, "Filtered List", schoolFilter, classFilter, paidOnly, dateFilter, schools, classes)
    } catch (error) {
      console.error("Failed to fetch all orders for PDF", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePackingSlip = async () => {
    try {
      setIsGenerating(true)
      const allOrders = await getFilteredOrdersForPrint(schoolFilter || undefined, classFilter || undefined, paidOnly || undefined, dateFilter || undefined)
      generatePackingSlipPDF(allOrders, "Packing Slip", schoolFilter, classFilter, paidOnly, dateFilter, schools, classes)
    } catch (error) {
      console.error("Failed to generate packing slip", error)
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
        <DropdownMenuItem onClick={handlePackingSlip}>
          📦 Export Packing Slip (Print & Delivery)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
