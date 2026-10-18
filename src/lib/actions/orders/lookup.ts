"use server";

import { getPayload } from "payload";
import config from "@payload-config";

export async function lookupGuestOrder(orderId: string, email: string) {
  if (!orderId || !email) {
    return {
      success: false,
      error: "Please enter both an Order Number and the Email used at checkout.",
    };
  }

  const cleanId = orderId.replace("#", "").trim();
  const cleanEmail = email.trim().toLowerCase();

  try {
    const payload = await getPayload({ config });
    const order = await payload.findByID({
      collection: "orders",
      id: cleanId,
    });

    if (!order) {
      return {
        success: false,
        error: `No order found with number #${cleanId}.`,
      };
    }

    const orderEmail = order.customerDetails?.email?.toLowerCase().trim();
    if (orderEmail !== cleanEmail) {
      return {
        success: false,
        error: "The email address entered does not match the one on record for this order.",
      };
    }

    return {
      success: true,
      orderId: cleanId,
    };
  } catch (error) {
    console.error("Error looking up guest order:", error);
    return {
      success: false,
      error: "Invalid Order Number or order not found.",
    };
  }
}
