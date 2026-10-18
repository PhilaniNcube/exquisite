import { getPayload } from "payload";
import config from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";

const PAID_STATUSES = ["completed", "processing", "printed"];

const orderRevenue = (order: any): number =>
  order.orderTotal ||
  order.productDetails?.orderItems?.reduce(
    (sum: number, item: any) => sum + (item.linePrice || 0),
    0,
  ) ||
  0;

export const getOrdersRevenue = async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("orders");
  const payload = await getPayload({ config });

  // depth 0: totals come from the persisted line price, so we never populate
  // the (potentially huge) product/picture relationships just to add up money.
  const orders = await payload.find({ collection: "orders", limit: 0, depth: 0 });

  let paidRevenue = 0;
  let pendingRevenue = 0;

  for (const order of orders.docs) {
    const revenue = orderRevenue(order);
    if (PAID_STATUSES.includes(order.orderStatus ?? "")) {
      paidRevenue += revenue;
    } else {
      pendingRevenue += revenue;
    }
  }

  return { paidRevenue, pendingRevenue };
};

export type StatCollection =
  | "products"
  | "customers"
  | "schools"
  | "schoolPhotos"
  | "client-galleries"
  | "photos"
  | "users";

export const getCollectionCount = async (collection: StatCollection) => {
  "use cache";
  cacheLife("hours");
  cacheTag(collection);
  const payload = await getPayload({ config });
  const result = await payload.count({ collection });
  return result.totalDocs;
};
