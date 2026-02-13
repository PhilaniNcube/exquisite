import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_ACCESS_SECRET || "",
  },
  forcePathStyle: true,
});

type GeneratePresignedUrlBody = {
  file: {
    name: string;
    type: string;
    size: number;
  };
};

function sanitizeFileName(name: string) {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9-_]/g, "-")
    .toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as GeneratePresignedUrlBody;
    const file = body?.file;

    if (!file?.name || !file?.type || !file?.size) {
      return NextResponse.json({ error: "Invalid file payload" }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const bucket = process.env.S3_BUCKET || "";
    if (!bucket) {
      return NextResponse.json({ error: "S3 bucket is not configured" }, { status: 500 });
    }

    const ext = file.name.split(".").pop();
    const key = `products/${sanitizeFileName(file.name)}-${Date.now()}-${crypto.randomBytes(8).toString("hex")}.${ext}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: file.type,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 900,
    });

    return NextResponse.json({
      key,
      uploadUrl,
    });
  } catch (error) {
    console.error("Error generating product upload URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 },
    );
  }
}
