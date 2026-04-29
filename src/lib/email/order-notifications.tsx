import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { render } from "@react-email/render";
import type { Customer, Order, Product, School, SchoolPhoto } from "@/payload-types";
import { Resend } from "resend";

type SupportedNotificationStatus = "completed" | "cancelled";

type OrderLineItem = {
  id: string;
  productName: string;
  pictureName: string;
  quantity: number;
  unitPrice: number;
  linePrice: number;
};

type OrderNotificationData = {
  orderId: number;
  status: SupportedNotificationStatus;
  statusLabel: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerCell: string;
  studentName: string;
  total: string;
  lineItems: OrderLineItem[];
  customerOrderUrl: string;
  adminOrderUrl: string;
  paymentId?: string;
};

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const currencyFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
});

const statusCopy: Record<
  SupportedNotificationStatus,
  {
    adminSubject: (orderId: number) => string;
    customerSubject: (orderId: number) => string;
    customerHeading: string;
    customerIntro: string;
    adminHeading: string;
    adminIntro: string;
    preview: (orderId: number) => string;
    label: string;
  }
> = {
  completed: {
    adminSubject: (orderId) => `New paid order #${orderId}`,
    customerSubject: (orderId) => `Your Exquisite order #${orderId} is confirmed`,
    customerHeading: "Your order is confirmed",
    customerIntro:
      "We have received your payment and your order is now confirmed. Here is a summary for your records.",
    adminHeading: "A customer order has been paid",
    adminIntro:
      "PayGate confirmed payment for this order. Use the summary below to start fulfillment.",
    preview: (orderId) => `Order #${orderId} payment confirmed`,
    label: "Completed",
  },
  cancelled: {
    adminSubject: (orderId) => `Order #${orderId} payment was cancelled`,
    customerSubject: (orderId) => `Your Exquisite order #${orderId} was cancelled`,
    customerHeading: "Your order was cancelled",
    customerIntro:
      "We received a cancellation notice for this order. If this was unexpected, you can place the order again or contact us for help.",
    adminHeading: "An order payment was cancelled",
    adminIntro:
      "PayGate reported this order as cancelled. Review the order details below if follow-up is required.",
    preview: (orderId) => `Order #${orderId} payment cancelled`,
    label: "Cancelled",
  },
};

function isCustomer(value: Order["customerDetails"]["customer"]): value is Customer {
  return typeof value === "object" && value !== null && "email" in value;
}

function isProduct(value: Order["productDetails"]["orderItems"][number]["product"]): value is Product {
  return typeof value === "object" && value !== null && "title" in value;
}

function isSchool(value: SchoolPhoto["schoolDetails"]["school"]): value is School {
  return typeof value === "object" && value !== null && "name" in value;
}

function isSchoolPhoto(value: Order["productDetails"]["orderItems"][number]["picture"]): value is SchoolPhoto {
  return typeof value === "object" && value !== null && "name" in value;
}

function formatCurrency(value: number) {
  return currencyFormatter.format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-ZA", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getCustomerName(customer: Customer) {
  const fullName = [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim();
  return fullName || "Customer";
}

function getPictureName(picture: Order["productDetails"]["orderItems"][number]["picture"]) {
  if (!isSchoolPhoto(picture)) {
    return "Selected school photo";
  }

  const schoolName = isSchool(picture.schoolDetails.school)
    ? picture.schoolDetails.school.name
    : null;

  return [picture.studentName, picture.name, schoolName]
    .filter(Boolean)
    .join(" - ");
}

function buildLineItems(order: Order): OrderLineItem[] {
  return order.productDetails.orderItems.map((item, index) => ({
    id: item.id ?? `${order.id}-${index}`,
    productName: isProduct(item.product) ? item.product.title : `Product #${item.product}`,
    pictureName: getPictureName(item.picture),
    quantity: item.quantity,
    unitPrice: item.priceAtPurchase,
    linePrice: item.linePrice,
  }));
}

function calculateOrderTotal(order: Order) {
  return order.productDetails.orderItems.reduce((sum, item) => sum + item.linePrice, 0);
}

function buildNotificationData(
  order: Order,
  customer: Customer,
  status: SupportedNotificationStatus,
): OrderNotificationData {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

  return {
    orderId: order.id,
    status,
    statusLabel: statusCopy[status].label,
    orderDate: formatDate(order.createdAt),
    customerName: getCustomerName(customer),
    customerEmail: customer.email,
    customerCell: order.customerDetails.cellNumber,
    studentName: order.customerDetails.studentName,
    total: formatCurrency(calculateOrderTotal(order)),
    lineItems: buildLineItems(order),
    customerOrderUrl: `${baseUrl}/orders?orderId=${order.id}`,
    adminOrderUrl: `${baseUrl}/dashboard/orders/${order.id}`,
    paymentId: order.paymentDetails?.payRequestId ?? undefined,
  };
}

type EmailLayoutProps = {
  preview: string;
  heading: string;
  intro: string;
  data: OrderNotificationData;
  ctaLabel: string;
  ctaHref: string;
  showCustomerDetails: boolean;
};

function EmailLayout({
  preview,
  heading,
  intro,
  data,
  ctaLabel,
  ctaHref,
  showCustomerDetails,
}: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.eyebrow}>Exquisite Photography</Text>
          <Heading style={styles.heading}>{heading}</Heading>
          <Text style={styles.paragraph}>{intro}</Text>

          <Section style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Order</Text>
            <Text style={styles.summaryValue}>#{data.orderId}</Text>
            <Text style={styles.metaText}>Status: {data.statusLabel}</Text>
            <Text style={styles.metaText}>Placed: {data.orderDate}</Text>
            <Text style={styles.metaText}>Total: {data.total}</Text>
            {data.paymentId ? <Text style={styles.metaText}>PayGate ID: {data.paymentId}</Text> : null}
          </Section>

          {showCustomerDetails ? (
            <Section style={styles.detailCard}>
              <Text style={styles.sectionTitle}>Customer</Text>
              <Text style={styles.detailText}>{data.customerName}</Text>
              <Text style={styles.detailText}>{data.customerEmail}</Text>
              <Text style={styles.detailText}>{data.customerCell}</Text>
              <Text style={styles.detailText}>Student: {data.studentName}</Text>
            </Section>
          ) : null}

          <Section style={styles.detailCard}>
            <Text style={styles.sectionTitle}>Items</Text>
            {data.lineItems.map((item) => (
              <Section key={item.id} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemMeta}>{item.pictureName}</Text>
                <Text style={styles.itemMeta}>
                  Qty {item.quantity} x {formatCurrency(item.unitPrice)} = {formatCurrency(item.linePrice)}
                </Text>
              </Section>
            ))}
          </Section>

          <Section style={styles.ctaSection}>
            <Link href={ctaHref} style={styles.button}>
              {ctaLabel}
            </Link>
          </Section>

          <Hr style={styles.hr} />
          <Text style={styles.footer}>
            Need help? Reply to this email or contact Exquisite Photography directly.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

function CustomerOrderNotificationEmail({ data }: { data: OrderNotificationData }) {
  const copy = statusCopy[data.status];

  return (
    <EmailLayout
      preview={copy.preview(data.orderId)}
      heading={copy.customerHeading}
      intro={`Hi ${data.customerName}, ${copy.customerIntro}`}
      data={data}
      ctaLabel="View your order"
      ctaHref={data.customerOrderUrl}
      showCustomerDetails={false}
    />
  );
}

function AdminOrderNotificationEmail({ data }: { data: OrderNotificationData }) {
  const copy = statusCopy[data.status];

  return (
    <EmailLayout
      preview={copy.preview(data.orderId)}
      heading={copy.adminHeading}
      intro={copy.adminIntro}
      data={data}
      ctaLabel="Open order in dashboard"
      ctaHref={data.adminOrderUrl}
      showCustomerDetails
    />
  );
}

export async function sendOrderStatusNotifications(order: Order) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not configured. Skipping order notification emails.");
    return;
  }

  const status = order.orderStatus;
  if (status !== "completed" && status !== "cancelled") {
    return;
  }

  const customer = order.customerDetails.customer;
  if (!isCustomer(customer)) {
    console.warn(`Order ${order.id} is missing a populated customer record. Skipping emails.`);
    return;
  }

  const from = process.env.FROM_EMAIL || "noreply@exquisitephoto.co.za";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@exquisitephoto.co.za";
  const data = buildNotificationData(order, customer, status);
  const copy = statusCopy[status];

  const [customerHtml, adminHtml] = await Promise.all([
    render(<CustomerOrderNotificationEmail data={data} />),
    render(<AdminOrderNotificationEmail data={data} />),
  ]);

  await Promise.all([
    resend.emails.send({
      from,
      to: [customer.email],
      subject: copy.customerSubject(order.id),
      html: customerHtml,
    }),
    resend.emails.send({
      from,
      to: [adminEmail],
      subject: copy.adminSubject(order.id),
      html: adminHtml,
      replyTo: customer.email,
    }),
  ]);
}

const styles = {
  body: {
    backgroundColor: "#f5f1ea",
    fontFamily: "Georgia, 'Times New Roman', serif",
    margin: 0,
    padding: "24px 0",
  },
  container: {
    backgroundColor: "#fffdf8",
    border: "1px solid #e6ddcf",
    borderRadius: "16px",
    margin: "0 auto",
    maxWidth: "640px",
    padding: "32px",
  },
  eyebrow: {
    color: "#8a6a37",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.16em",
    margin: "0 0 12px",
    textTransform: "uppercase" as const,
  },
  heading: {
    color: "#23180d",
    fontSize: "30px",
    fontWeight: "700",
    lineHeight: "1.2",
    margin: "0 0 16px",
  },
  paragraph: {
    color: "#4b3b2b",
    fontSize: "16px",
    lineHeight: "1.7",
    margin: "0 0 24px",
  },
  summaryCard: {
    backgroundColor: "#f2eadf",
    borderRadius: "14px",
    marginBottom: "20px",
    padding: "20px",
  },
  summaryLabel: {
    color: "#8a6a37",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    margin: "0 0 4px",
    textTransform: "uppercase" as const,
  },
  summaryValue: {
    color: "#23180d",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 12px",
  },
  metaText: {
    color: "#4b3b2b",
    fontSize: "14px",
    margin: "0 0 6px",
  },
  detailCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #eadfce",
    borderRadius: "14px",
    marginBottom: "16px",
    padding: "20px",
  },
  sectionTitle: {
    color: "#23180d",
    fontSize: "16px",
    fontWeight: "700",
    margin: "0 0 12px",
  },
  detailText: {
    color: "#4b3b2b",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0 0 6px",
  },
  itemRow: {
    borderTop: "1px solid #efe6d9",
    padding: "14px 0",
  },
  itemName: {
    color: "#23180d",
    fontSize: "15px",
    fontWeight: "700",
    margin: "0 0 6px",
  },
  itemMeta: {
    color: "#5e4f41",
    fontSize: "14px",
    lineHeight: "1.6",
    margin: "0 0 4px",
  },
  ctaSection: {
    padding: "16px 0 8px",
    textAlign: "center" as const,
  },
  button: {
    backgroundColor: "#2e5c4d",
    borderRadius: "999px",
    color: "#fffdf8",
    display: "inline-block",
    fontSize: "14px",
    fontWeight: "700",
    padding: "14px 22px",
    textDecoration: "none",
  },
  hr: {
    borderColor: "#eadfce",
    margin: "28px 0 16px",
  },
  footer: {
    color: "#7a6b5d",
    fontSize: "12px",
    lineHeight: "1.6",
    margin: 0,
  },
};