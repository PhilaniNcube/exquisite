import { createClient } from "@libsql/client";

async function run() {
  const client = createClient({
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_ACCESS_TOKEN,
  });

  try {
    const res = await client.execute({
      sql: 'select "id", "title", "price", "image_id", "available_for_group_sports", "product_details", "updated_at", "created_at" from "products" "products" where "products"."id" in (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) order by "products"."created_at" desc',
      args: [25, 23, 11, 20, 12, 15, 21, 22, 3, 2, 10, 8, 13, 19, 9, 18, 24, 5, 7, 14, 1, 17, 6, 4, 16],
    });
    console.log("Success! Rows returned:", res.rows.length);
    console.log("Sample row:", res.rows[0]);
  } catch (error) {
    console.error("Execution error:", error);
  } finally {
    client.close();
  }
}

run();
