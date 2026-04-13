"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { Order } from "@/payload-types";
import { z } from "zod";
import {headers as getHeaders} from "next/headers";
import { getPayFastService } from "@/lib/payfast";
import { revalidatePath } from "next/cache";

// Validation schema for order creation
const orderItemSchema = z.object({
  product: z.union([z.string(), z.number()]).transform((val) => typeof val === 'string' ? parseInt(val, 10) : val),
  quantity: z.number().min(1),
  priceAtPurchase: z.number().min(0),
  linePrice: z.number().min(0),
  picture: z.union([z.string(), z.number()]).transform((val) => typeof val === 'string' ? parseInt(val, 10) : val),
});

const orderSchema = z.object({
  customerDetails: z.object({
    cellNumber: z.string().min(1, "Cell number is required"),
  }),
  productDetails: z.object({
    orderItems: z.array(orderItemSchema).min(1, "At least one item is required"),
  }),
  orderStatus: z.enum(["pending", "processing", "completed", "cancelled"]).optional().default("pending"),
});

export const createOrder = async (prevState: unknown, formData: FormData) => {
  try {
    const payload = await getPayload({ config });
    const headers = await getHeaders();
    const result = await payload.auth({ headers, canSetHeaders: false })

    // get the user from the customers collection
    const user = result.user?.collection === "customers" ? result.user : null;


    if (!user) {
      return {
        success: false,
        message: "You must be logged in to place an order",
        error: "Unauthorized",
      };
    }

    // Extract form data
    const cellNumber = formData.get("cellNumber") as string;
    const orderItemsJson = formData.get("orderItems") as string;

    if (!orderItemsJson) {
      return {
        success: false,
        message: "No order items provided",
        error: "Missing order items",
      };
    }

    const orderItems = JSON.parse(orderItemsJson);

    // Validate the data
    const orderData = {
      customerDetails: {
        customer: user.id,
        cellNumber,
      },
      productDetails: {
        orderItems,
      },
      orderStatus: "pending" as const,
    };

    const validationResult = orderSchema.safeParse(orderData);
    
    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid order data",
        error: validationResult.error.issues[0]?.message || "Validation failed",
      };
    }

    const validatedData = validationResult.data;

    // Prepare order data matching the Order type from payload-types
    const finalOrderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
      customerDetails: {
        customer: user.id,
        cellNumber: validatedData.customerDetails.cellNumber,
      },
      productDetails: {
        orderItems: validatedData.productDetails.orderItems,
      },
      orderStatus: validatedData.orderStatus,
    };

    // Create the order
    const order = await payload.create({
      collection: "orders",
      data: finalOrderData,
    });

    // Generate PayFast payment data
    const payfastService = getPayFastService();
    const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

    const customerEmail = typeof user.email === "string" ? user.email : "customer@example.com";
    const firstName = user.firstName || "Customer";
    const lastName = user.lastName || "User";

    // Calculate total amount
    const totalAmount = validatedData.productDetails.orderItems.reduce(
      (sum, item) => sum + item.linePrice,
      0
    );

    const paymentData = payfastService.createPaymentData({
      orderId: order.id.toString(),
      amount: totalAmount,
      itemName: `Order #${order.id}`,
      itemDescription: `Payment for order #${order.id}`,
      customerFirstName: firstName,
      customerLastName: lastName,
      customerEmail,
      customerCell: cellNumber,
      returnUrl: `${baseUrl}/checkout/success?orderId=${order.id}`,
      cancelUrl: `${baseUrl}/checkout/cancel?orderId=${order.id}`,
      notifyUrl: `${baseUrl}/api/payfast/notify`,
    });

    return {
      success: true,
      message: "Order created successfully",
      orderId: order.id,
      error: "",
      paymentData: Object.fromEntries(
        Object.entries(paymentData).filter(([, v]) => v !== undefined)
      ) as Record<string, string>,
      paymentUrl: payfastService.paymentUrl,
    };

  } catch (error) {
    console.error("Error creating order:", error);
    
    return {
      success: false,
      message: "Failed to create order",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

const deleteOrderSchema = z.object({
  orderId: z.number().int().positive(),
});

export async function deleteOrder(orderId: number) {
  const validatedFields = deleteOrderSchema.safeParse({ orderId });

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid order ID",
    };
  }

  try {
    const payload = await getPayload({ config });
    const headers = await getHeaders();
    const result = await payload.auth({ headers, canSetHeaders: false });

    const isAdmin =
      result.user?.collection === "users" &&
      result.user.roles?.includes("admin");

    if (!isAdmin) {
      return {
        success: false,
        message: "Unauthorized: Admin access required",
      };
    }

    await payload.delete({
      collection: "orders",
      id: validatedFields.data.orderId,
    });

    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${validatedFields.data.orderId}`);
    revalidatePath("/orders");

    return {
      success: true,
      message: "Order deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting order:", error);

    return {
      success: false,
      message: "Failed to delete order",
    };
  }
}
