import { createClient } from "@libsql/client";

async function run() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_ACCESS_TOKEN,
  });

  try {
    const res = await client.execute("SELECT * FROM orders_product_details_order_items LIMIT 5");
    console.log("order items sample:", res.rows);
  } catch (error) {
    console.error("error:", error);
  } finally {
    client.close();
  }
}

run();
