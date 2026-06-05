import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "enum_orders_order_status" ADD VALUE 'printed';
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "enum_orders_order_status" RENAME TO "enum_orders_order_status_old";
    CREATE TYPE "enum_orders_order_status" AS ENUM ('pending', 'processing', 'completed', 'cancelled');
    ALTER TABLE "orders" ALTER COLUMN "order_status" TYPE "enum_orders_order_status" USING "order_status"::text::"enum_orders_order_status";
    DROP TYPE "enum_orders_order_status_old";
  `)
}
