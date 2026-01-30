// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";
import { Media } from "./collections/Media";
import { s3Storage } from "@payloadcms/storage-s3";
import { resendAdapter } from "@payloadcms/email-resend";
import { Users } from "./collections/Users/config";
import Categories from "./collections/Categories";
import Photos from "./collections/Photos";
import { Customers } from "./collections/Customers/config";
import { ClientGalleries } from "./collections/ClientGalleries/config";
import { Schools } from "./collections/Schools/config";
import { Classes } from "./collections/Classes/config";
import { Products } from "./collections/Products/config";
import { SchoolPhotos } from "./collections/SchoolPhotos/config";
import { Orders } from "./collections/Orders/config";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || '',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  email: resendAdapter({
    defaultFromAddress: "este@exquisitephoto.co.za",
    defaultFromName: "Exquisite Photography",
    apiKey: process.env.RESEND_API_KEY || "",
    
  }),
  collections: [
    Users,
    Media,
    Categories,
    Photos,
    Customers,
    ClientGalleries,
    Schools,
    Classes,
    Products,
    SchoolPhotos,
    Orders,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  // database-adapter-config-start
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || process.env.DATABASE_URL,
    },
    // Explicitly configure SSL to avoid future deprecation warnings
    migrationDir: path.resolve(dirname, 'migrations'),
  }),
  // database-adapter-config-end
  sharp,
  plugins: [
    // payloadCloudPlugin(),
    // storage-adapter-placeholder
    s3Storage({
      collections: {
        media: true,
      },
      clientUploads: true,
      bucket: process.env.S3_BUCKET || "",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
          secretAccessKey: process.env.S3_ACCESS_SECRET || "",
        },
        region: "auto",
        endpoint: process.env.S3_ENDPOINT || "",
        forcePathStyle: true,
      },
    }),
  ],
});

