import { getPayload } from "payload";
import config from "@payload-config";

async function run() {
  const payload = await getPayload({ config });
  // Find an admin user
  const adminUsers = await payload.find({
    collection: "users",
    limit: 1,
  });
  console.log("Admin user sample:", adminUsers.docs[0]);
}

run();
