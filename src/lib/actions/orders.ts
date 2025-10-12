"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { getUser } from "@/lib/auth";
import { Order } from "@/payload-types";
import { z } from "zod";
import { redirect } from "next/navigation";

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
    const user = await getUser();

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

    // Redirect to orders page with orderId
    redirect(`/orders?orderId=${order.id}`);

  } catch (error) {
    console.error("Error creating order:", error);
    
    return {
      success: false,
      message: "Failed to create order",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
