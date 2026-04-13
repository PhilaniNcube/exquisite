import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { getPayFastService } from "@/lib/payfast";
import { headers as getHeaders } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config });
    const headers = await getHeaders();
    const result = await payload.auth({ headers, canSetHeaders: false });

    // Get the user from the customers collection
    const user =
      result.user?.collection === "customers" ? result.user : null;

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to initialize payment" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, cellNumber } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Fetch the order
    const order = await payload.findByID({
      collection: "orders",
      id: orderId,
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Verify the order belongs to the user
    const customerId =
      typeof order.customerDetails.customer === "object"
        ? order.customerDetails.customer.id
        : order.customerDetails.customer;

    if (customerId !== user.id) {
      return NextResponse.json(
        { error: "Unauthorized to access this order" },
        { status: 403 }
      );
    }

    // Calculate total amount
    const totalAmount = order.productDetails.orderItems.reduce(
      (sum, item) => sum + item.linePrice,
      0
    );

    // Get customer data
    const customer =
      typeof order.customerDetails.customer === "object"
        ? order.customerDetails.customer
        : await payload.findByID({
            collection: "customers",
            id: order.customerDetails.customer,
          });

    const customerEmail =
      typeof customer.email === "string" ? customer.email : "customer@example.com";
    const firstName = customer.firstName || "Customer";
    const lastName = customer.lastName || "User";

    // Initialize PayFast service
    const payfastService = getPayFastService();
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

    // Create payment data
    const paymentData = payfastService.createPaymentData({
      orderId: order.id.toString(),
      amount: totalAmount,
      itemName: `Order #${order.id}`,
      itemDescription: `Payment for order #${order.id}`,
      customerFirstName: firstName,
      customerLastName: lastName,
      customerEmail: customerEmail,
      customerCell: cellNumber || order.customerDetails.cellNumber,
      returnUrl: `${baseUrl}/checkout/success?orderId=${order.id}`,
      cancelUrl: `${baseUrl}/checkout/cancel?orderId=${order.id}`,
      notifyUrl: `${baseUrl}/api/payfast/notify`,
    });

    // Return payment data for form submission
    return NextResponse.json({
      success: true,
      paymentData,
      paymentUrl: payfastService.paymentUrl,
    });
  } catch (error) {
    console.error("Error initializing PayFast payment:", error);
    return NextResponse.json(
      {
        error: "Failed to initialize payment",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
