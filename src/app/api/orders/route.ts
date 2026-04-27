import { getPayload } from "payload";
import config from "@payload-config";
import { Order } from "@/payload-types";
import { z } from "zod";
import crypto from "crypto";

const PAYGATE_ID = process.env.PAYGATE_ID || "";
const ENCRYPTION_KEY = process.env.PAYGATE_ENCRYPTION_KEY || "";
const PAYGATE_INITIATE_URL = "https://secure.paygate.co.za/payweb3/initiate.trans";
const PAYGATE_REDIRECT_URL =
  process.env.PAYGATE_REDIRECT_URL ||
  "https://secure.paygate.co.za/payweb3/process.trans";

const orderItemSchema = z.object({
  product: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val)),
  quantity: z.number().min(1),
  priceAtPurchase: z.number().min(0),
  linePrice: z.number().min(0),
  picture: z
    .union([z.string(), z.number()])
    .transform((val) => (typeof val === "string" ? parseInt(val, 10) : val)),
});

const orderSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  cellNumber: z.string().min(1, "Cell number is required"),
  orderItems: z.array(orderItemSchema).min(1, "At least one item is required"),
});

export async function POST(req: Request) {
  console.log("[Orders API] POST request received");
  try {
    console.log("[Orders API] Step 1: Authenticating user...");
    const payload = await getPayload({ config });
    const result = await payload.auth({ headers: req.headers, canSetHeaders: false });
    console.log("[Orders API] Step 1 done. User collection:", result.user?.collection);

    const user =
      result.user?.collection === "customers" ? result.user : null;

    console.log("[Orders API] Step 2: Parsing request body...");
    const body = await req.json();
    const validationResult = orderSchema.safeParse(body);
    console.log("[Orders API] Step 2 done. Valid:", validationResult.success);

    if (!validationResult.success) {
      return Response.json(
        {
          success: false,
          message: validationResult.error.issues[0]?.message || "Validation failed",
        },
        { status: 400 }
      );
    }

    const { name, email, cellNumber, orderItems } = validationResult.data;

    const finalOrderData: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
      customerDetails: {
        customer: user?.id || null,
        name: name || undefined,
        email: email || undefined,
        cellNumber,
      },
      productDetails: {
        orderItems,
      },
      orderStatus: "pending",
    };

    console.log("[Orders API] Step 3: Creating order in DB...");
    const order = await payload.create({
      collection: "orders",
      data: finalOrderData,
    });
    console.log("[Orders API] Step 3 done. Order ID:", order.id);

    // Use PAYGATE_RETURN_BASE_URL for callback URLs sent to PayGate.
    // CloudFront WAF blocks requests containing "localhost" in the body.
    // For local dev, use a tunnel (e.g. ngrok) URL or your production domain.
    const callbackBaseUrl =
      process.env.PAYGATE_RETURN_BASE_URL ||
      process.env.NEXT_PUBLIC_SERVER_URL ||
      "http://localhost:3000";
    const customerEmail =
      (user && typeof user.email === "string") ? user.email : (email || "customer@example.com");

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.linePrice,
      0
    );
    const amountInCents = Math.round(totalAmount * 100);

    const data: Record<string, string> = {
      PAYGATE_ID,
      REFERENCE: order.id.toString(),
      AMOUNT: amountInCents.toString(),
      CURRENCY: "ZAR",
      RETURN_URL: `${callbackBaseUrl}/api/paygate/return?orderId=${order.id}`,
      TRANSACTION_DATE: new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19),
      LOCALE: "en-za",
      COUNTRY: "ZAF",
      EMAIL: customerEmail,
      NOTIFY_URL: `${callbackBaseUrl}/api/paygate/notify`,
    };

    // Generate checksum: md5(all values joined + encryption key)
    const checksumString = Object.values(data).join("") + ENCRYPTION_KEY;
    data.CHECKSUM = crypto
      .createHash("md5")
      .update(checksumString)
      .digest("hex");

    console.log("[Orders API] Step 4: Calling PayGate initiate...");
    console.log("[PayGate] Request data:", {
      payGateId: PAYGATE_ID,
      reference: data.REFERENCE,
      amount: data.AMOUNT,
      returnUrl: data.RETURN_URL,
      notifyUrl: data.NOTIFY_URL,
    });

    const pgResponse = await fetch(PAYGATE_INITIATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data).toString(),
    });

    console.log("[Orders API] Step 5: PayGate responded. Status:", pgResponse.status);

    if (!pgResponse.ok) {
      const errorBody = await pgResponse.text();
      console.error("[PayGate] Error body:", errorBody.substring(0, 300));
      throw new Error(`PayGate initiate HTTP error: ${pgResponse.status} - ${errorBody.substring(0, 300)}`);
    }

    const responseText = await pgResponse.text();
    console.log("[PayGate] Response body:", responseText);

    const responseParams = new URLSearchParams(responseText);
    const pgResult: Record<string, string> = {};
    responseParams.forEach((value, key) => {
      pgResult[key] = value;
    });

    if (pgResult.ERROR) {
      throw new Error(`PayGate initiate error: ${pgResult.ERROR}`);
    }

    if (!pgResult.PAY_REQUEST_ID) {
      throw new Error(
        `PayGate initiate failed: no PAY_REQUEST_ID. Response: ${responseText}`
      );
    }

    // Build redirect checksum: md5(PAYGATE_ID + PAY_REQUEST_ID + REFERENCE + key)
    const redirectChecksum = crypto
      .createHash("md5")
      .update(
        PAYGATE_ID +
          pgResult.PAY_REQUEST_ID +
          pgResult.REFERENCE +
          ENCRYPTION_KEY
      )
      .digest("hex");

    return Response.json({
      success: true,
      orderId: order.id,
      paymentData: {
        PAY_REQUEST_ID: pgResult.PAY_REQUEST_ID,
        CHECKSUM: redirectChecksum,
      },
      paymentUrl: PAYGATE_REDIRECT_URL,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return Response.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 }
    );
  }
}
