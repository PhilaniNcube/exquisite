import { getPayload } from "payload";
import config from "@payload-config";
import { cacheLife } from "next/cache";

export const getProducts = async (options?: {
  page?: number;
  limit?: number;
}) => {
  "use cache";
  cacheLife("hours");
  const payload = await getPayload({ config });
  const products = await payload.find({
    collection: "products",
    limit: options?.limit || 10,
    page: options?.page || 1,
  });
  return products;
};

export const getProductById = async (id: number) => {
  "use cache";
  cacheLife("hours");
  const payload = await getPayload({ config });
  const product = await payload.findByID({
    collection: "products",
    id,
  });
  return product;
};
