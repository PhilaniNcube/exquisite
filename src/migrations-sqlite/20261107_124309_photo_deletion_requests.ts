import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`photo_deletion_requests\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`reference\` text NOT NULL,
  	\`status\` text DEFAULT 'pending' NOT NULL,
  	\`parent_name\` text NOT NULL,
  	\`parent_email\` text NOT NULL,
  	\`parent_phone\` text,
  	\`relationship\` text DEFAULT 'Parent' NOT NULL,
  	\`order_number\` text,
  	\`child_names\` text NOT NULL,
  	\`school_id\` integer NOT NULL,
  	\`class_id\` integer,
  	\`photo_snapshot\` text,
  	\`request_type\` text DEFAULT 'selected_photos' NOT NULL,
  	\`reason\` text,
  	\`declaration\` integer DEFAULT false NOT NULL,
  	\`admin_notes\` text,
  	\`reviewed_by_id\` integer,
  	\`reviewed_at\` text,
  	\`completed_at\` text,
  	\`requester_ip\` text,
  	\`requester_user_agent\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`school_id\`) REFERENCES \`schools\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`class_id\`) REFERENCES \`classes\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`reviewed_by_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`CREATE UNIQUE INDEX \`photo_deletion_requests_reference_idx\` ON \`photo_deletion_requests\` (\`reference\`);`)
  await db.run(sql`CREATE INDEX \`photo_deletion_requests_school_idx\` ON \`photo_deletion_requests\` (\`school_id\`);`)
  await db.run(sql`CREATE INDEX \`photo_deletion_requests_class_idx\` ON \`photo_deletion_requests\` (\`class_id\`);`)
  await db.run(sql`CREATE INDEX \`photo_deletion_requests_reviewed_by_idx\` ON \`photo_deletion_requests\` (\`reviewed_by_id\`);`)
  await db.run(sql`CREATE INDEX \`photo_deletion_requests_updated_at_idx\` ON \`photo_deletion_requests\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`photo_deletion_requests_created_at_idx\` ON \`photo_deletion_requests\` (\`created_at\`);`)
  await db.run(sql`CREATE TABLE \`photo_deletion_requests_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`school_photos_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`photo_deletion_requests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`school_photos_id\`) REFERENCES \`school_photos\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`photo_deletion_requests_rels_order_idx\` ON \`photo_deletion_requests_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`photo_deletion_requests_rels_parent_idx\` ON \`photo_deletion_requests_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`photo_deletion_requests_rels_path_idx\` ON \`photo_deletion_requests_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`photo_deletion_requests_rels_school_photos_id_idx\` ON \`photo_deletion_requests_rels\` (\`school_photos_id\`);`)
  await db.run(sql`ALTER TABLE \`school_photos\` ADD \`visibility\` text DEFAULT 'public' NOT NULL;`)
  await db.run(sql`CREATE INDEX \`school_photos_visibility_idx\` ON \`school_photos\` (\`visibility\`);`)
  await db.run(sql`ALTER TABLE \`payload_locked_documents_rels\` ADD \`photo_deletion_requests_id\` integer REFERENCES photo_deletion_requests(id);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_photo_deletion_requests_id_idx\` ON \`payload_locked_documents_rels\` (\`photo_deletion_requests_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`photo_deletion_requests\`;`)
  await db.run(sql`DROP TABLE \`photo_deletion_requests_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` integer,
  	\`media_id\` integer,
  	\`categories_id\` integer,
  	\`photos_id\` integer,
  	\`customers_id\` integer,
  	\`client_galleries_id\` integer,
  	\`schools_id\` integer,
  	\`classes_id\` integer,
  	\`products_id\` integer,
  	\`school_photos_id\` integer,
  	\`orders_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`categories_id\`) REFERENCES \`categories\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`photos_id\`) REFERENCES \`photos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`customers_id\`) REFERENCES \`customers\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`client_galleries_id\`) REFERENCES \`client_galleries\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`schools_id\`) REFERENCES \`schools\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`classes_id\`) REFERENCES \`classes\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`products_id\`) REFERENCES \`products\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`school_photos_id\`) REFERENCES \`school_photos\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`orders_id\`) REFERENCES \`orders\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`INSERT INTO \`__new_payload_locked_documents_rels\`("id", "order", "parent_id", "path", "users_id", "media_id", "categories_id", "photos_id", "customers_id", "client_galleries_id", "schools_id", "classes_id", "products_id", "school_photos_id", "orders_id") SELECT "id", "order", "parent_id", "path", "users_id", "media_id", "categories_id", "photos_id", "customers_id", "client_galleries_id", "schools_id", "classes_id", "products_id", "school_photos_id", "orders_id" FROM \`payload_locked_documents_rels\`;`)
  await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
  await db.run(sql`ALTER TABLE \`__new_payload_locked_documents_rels\` RENAME TO \`payload_locked_documents_rels\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_categories_id_idx\` ON \`payload_locked_documents_rels\` (\`categories_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_photos_id_idx\` ON \`payload_locked_documents_rels\` (\`photos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_customers_id_idx\` ON \`payload_locked_documents_rels\` (\`customers_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_client_galleries_id_idx\` ON \`payload_locked_documents_rels\` (\`client_galleries_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_schools_id_idx\` ON \`payload_locked_documents_rels\` (\`schools_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_classes_id_idx\` ON \`payload_locked_documents_rels\` (\`classes_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_products_id_idx\` ON \`payload_locked_documents_rels\` (\`products_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_school_photos_id_idx\` ON \`payload_locked_documents_rels\` (\`school_photos_id\`);`)
  await db.run(sql`CREATE INDEX \`payload_locked_documents_rels_orders_id_idx\` ON \`payload_locked_documents_rels\` (\`orders_id\`);`)
  await db.run(sql`DROP INDEX \`school_photos_visibility_idx\`;`)
  await db.run(sql`ALTER TABLE \`school_photos\` DROP COLUMN \`visibility\`;`)
}
