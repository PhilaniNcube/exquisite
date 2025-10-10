import { getPayload } from "payload";
import config from "@payload-config";

export const getProducts = async (options?: {
  page?: number;
  limit?: number;
}) => {
  const payload = await getPayload({ config });
  const products = await payload.find({
    collection: "products",
    limit: options?.limit || 10,
    page: options?.page || 1,
  });
  return products;
};

export const getProductById = async (id: number) => {
  const payload = await getPayload({ config });
  const product = await payload.findByID({
    collection: "products",
    id,
  });
  return product;
};
