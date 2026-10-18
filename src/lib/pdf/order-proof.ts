import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { Order, Product, SchoolPhoto, School, Class as PayloadClass, Customer } from "@/payload-types";
import { formatPrice } from "@/lib/utils";

function getStatusText(status?: string | null): string {
  if (!status) return "PENDING";
  if (status === "printed") return "PRINTED & DELIVERED";
  if (status === "completed") return "PAID & COMPLETED";
  return status.toUpperCase();
}

export function generateOrderProofPDF(order: Order) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  // ── Header: Brand Banner ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text("EXQUISITE PHOTOGRAPHY", 14, yPos);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(14, 116, 144); // cyan-700
  doc.text("OFFICIAL PROOF OF ORDER & PAYMENT RECEIPT", 14, yPos + 6);

  // Top right: Order # and Date
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139); // slate-500
  let orderDate = "";
  try {
    orderDate = format(new Date(order.createdAt), "dd MMMM yyyy, HH:mm");
  } catch {
    orderDate = String(order.createdAt);
  }
  doc.text(`Order Ref: #${order.id}`, pageWidth - 14, yPos, { align: "right" });
  doc.text(`Date: ${orderDate}`, pageWidth - 14, yPos + 5, { align: "right" });

  yPos += 14;

  // Horizontal Rule
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(14, yPos, pageWidth - 14, yPos);
  yPos += 8;

  // ── Status Banner ──
  const isPaid = order.orderStatus === "completed" || order.orderStatus === "printed";
  if (isPaid) {
    doc.setFillColor(236, 253, 245); // emerald-50
    doc.setDrawColor(167, 243, 208); // emerald-200
  } else {
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240); // slate-200
  }
  doc.roundedRect(14, yPos - 3, pageWidth - 28, 11, 2, 2, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  if (isPaid) {
    doc.setTextColor(5, 150, 105); // emerald-600
  } else {
    doc.setTextColor(71, 85, 105); // slate-600
  }
  doc.text(`ORDER STATUS: ${getStatusText(order.orderStatus)}`, 18, yPos + 4);

  if (order.paymentReference) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Payment Reference: ${order.paymentReference}`, pageWidth - 18, yPos + 4, {
      align: "right",
    });
  }

  yPos += 16;

  // ── Two Columns: Customer Info & Order Metadata ──
  const customerObj =
    typeof order.customerDetails?.customer === "object"
      ? (order.customerDetails.customer as Customer)
      : null;

  const parentName =
    order.customerDetails?.name ||
    [customerObj?.firstName, customerObj?.lastName].filter(Boolean).join(" ") ||
    "Parent / Guardian";

  const email = order.customerDetails?.email || customerObj?.email || "—";
  const phone = order.customerDetails?.cellNumber || "—";
  const studentNames = order.customerDetails?.studentName || "—";

  // Left Column: Parent Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text("CUSTOMER & PARENT DETAILS", 14, yPos);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Parent Name: ${parentName}`, 14, yPos + 5);
  doc.text(`Email: ${email}`, 14, yPos + 10);
  doc.text(`Cell Number: ${phone}`, 14, yPos + 15);

  // Right Column: Student & Fulfillment Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);
  doc.text("STUDENT & FULFILLMENT DETAILS", 110, yPos);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Student(s): ${studentNames}`, 110, yPos + 5);
  doc.text(`Delivery: Distributed via School`, 110, yPos + 10);
  doc.text(`Provider: Exquisite Photography`, 110, yPos + 15);

  yPos += 24;

  // ── Table of Items ──
  const tableRows: any[] = [];
  let computedTotal = 0;

  if (order.productDetails?.orderItems) {
    order.productDetails.orderItems.forEach((item, index) => {
      const prod = typeof item.product === "object" ? (item.product as Product) : null;
      const photo = typeof item.picture === "object" ? (item.picture as SchoolPhoto) : null;

      const prodTitle = prod?.title || "School Photo Print";
      const photoName = photo?.name || "Photo";

      let schoolAndClass = "";
      if (photo?.schoolDetails?.school && typeof photo.schoolDetails.school === "object") {
        schoolAndClass += (photo.schoolDetails.school as School).name;
      }
      if (photo?.schoolDetails?.class && typeof photo.schoolDetails.class === "object") {
        schoolAndClass += (schoolAndClass ? " - " : "") + (photo.schoolDetails.class as PayloadClass).name;
      }

      const childName = item.childName || order.customerDetails?.studentName || "—";
      const unitPrice = item.priceAtPurchase || 0;
      const lineTotal = item.linePrice || unitPrice * item.quantity;
      computedTotal += lineTotal;

      tableRows.push([
        String(index + 1),
        childName,
        `${photoName}${schoolAndClass ? `\n(${schoolAndClass})` : ""}`,
        prodTitle,
        String(item.quantity),
        formatPrice(unitPrice),
        formatPrice(lineTotal),
      ]);
    });
  }

  const orderTotal = order.orderTotal || computedTotal;

  autoTable(doc, {
    startY: yPos,
    head: [["#", "Child Name", "Photo / School", "Product / Package", "Qty", "Price", "Total"]],
    body: tableRows,
    foot: [
      [
        {
          content: "Grand Total Paid:",
          colSpan: 6,
          styles: { fontStyle: "bold", halign: "right", fontSize: 9.5, textColor: [30, 41, 59] },
        },
        {
          content: formatPrice(orderTotal),
          styles: { fontStyle: "bold", halign: "right", fontSize: 10, textColor: [14, 116, 144] },
        },
      ],
    ],
    theme: "striped",
    headStyles: {
      fillColor: [30, 41, 59], // slate-800
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: "bold",
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [226, 232, 240],
      lineWidth: 0.2,
      overflow: "linebreak",
    },
    columnStyles: {
      0: { cellWidth: 8, halign: "center" },
      1: { cellWidth: 32 },
      2: { cellWidth: 48 },
      3: { cellWidth: 42 },
      4: { cellWidth: 12, halign: "center" },
      5: { cellWidth: 20, halign: "right" },
      6: { cellWidth: 20, halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || yPos + 50;
  let footerY = Math.max(finalY + 12, 245);

  // Check if we need an extra page for the footer notes
  if (footerY > doc.internal.pageSize.getHeight() - 35) {
    doc.addPage();
    footerY = 25;
  }

  // ── Footer Note & Official Assurance ──
  doc.setDrawColor(226, 232, 240);
  doc.line(14, footerY, pageWidth - 14, footerY);
  footerY += 6;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text("Thank you for your order with Exquisite Photography!", 14, footerY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    "Please retain this document as proof of order for school distribution and personal records.",
    14,
    footerY + 4
  );
  doc.text(
    "For inquiries, please email este@exquisitephoto.co.za or visit https://exquisitephoto.co.za",
    14,
    footerY + 8
  );

  doc.save(`Exquisite-Photography-Order-${order.id}-Proof.pdf`);
}
