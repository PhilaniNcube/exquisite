import { getPayload } from "payload";
import config from "@payload-config";

async function run() {
  try {
    const payload = await getPayload({ config });
    const customers = await payload.find({
      collection: "customers",
      limit: 1,
    });
    const customer = customers.docs[0];
    console.log("Testing payload.find on orders with customer:", customer.email, "id:", customer.id);

    const result = await payload.find({
      collection: "orders",
      depth: 1,
      overrideAccess: false,
      user: customer,
    });
    console.log("payload.find with customer success, docs:", result.docs.length);
  } catch (err: any) {
    console.error("payload.find with customer FAILED!");
    console.error("Message:", err.message);
    console.error("Cause:", err.cause);
  }
}

run();
