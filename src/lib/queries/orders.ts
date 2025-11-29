import { getPayload } from "payload";
import config from "@payload-config";
import { Order } from "@/payload-types";
import { cacheLife, cacheTag } from "next/cache";

export const getOrders = async (page = 1, limit = 10) => {
  "use cache";
  cacheLife("minutes");
  cacheTag("orders");
  const payload = await getPayload({ config });
  const orders = await payload.find({
    collection: "orders",
    depth: 4,
    page,
    limit,
  });
  return orders;
};

export const getOrder = async (id: number) => {
  const payload = await getPayload({ config });
  const order = await payload.findByID({
    collection: "orders",
    id,
    depth: 4,
  });
  return order;
};
