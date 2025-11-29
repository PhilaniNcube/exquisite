import { getPayload } from "payload";
import config from "@payload-config";

export const getCustomers = async (options?: {
  page?: number;
  limit?: number;
}) => {
  const payload = await getPayload({ config });
  const customersData = await payload.find({
    collection: "customers",
    ...options,
  });
  return customersData;
};

// get customer by id
export const getCustomerById = async (id: string) => {
  const payload = await getPayload({ config });
  const customer = await payload.findByID({
    collection: "customers",
    id: id,
  });
  return customer;
};
