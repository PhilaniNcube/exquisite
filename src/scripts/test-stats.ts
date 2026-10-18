import { getPayload } from "payload";
import config from "@payload-config";

async function test() {
  try {
    const payload = await getPayload({ config });
    const adminUsers = await payload.find({
      collection: "users",
      limit: 1,
    });
    const adminUser = adminUsers.docs[0];
    console.log("Running with adminUser:", adminUser.email);

    const orders = await payload.find({
      collection: "orders",
      limit: 0,
      depth: 1,
      overrideAccess: false,
      user: adminUser,
    });
    console.log("Success with adminUser! Orders count:", orders.totalDocs);
  } catch (err: any) {
    console.error("FAILED with adminUser!");
    console.error("Message:", err.message);
    console.error("Cause:", err.cause);
  }
}

test();
