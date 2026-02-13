import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

type RegisterUploadedMediaBody = {
  key: string;
  originalName: string;
  type: string;
  size: number;
  alt?: string;
};

const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.S3_ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_ACCESS_SECRET || "",
  },
  forcePathStyle: true,
});

async function streamToBuffer(stream: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterUploadedMediaBody;

    if (!body?.key || !body?.originalName || !body?.type || !body?.size) {
      return NextResponse.json(
        { error: "Invalid register payload" },
        { status: 400 },
      );
    }

    const bucket = process.env.S3_BUCKET || "";
    if (!bucket) {
      return NextResponse.json(
        { error: "S3 bucket is not configured" },
        { status: 500 },
      );
    }

    const object = await s3Client.send(
      new GetObjectCommand({
        Bucket: bucket,
        Key: body.key,
      }),
    );

    if (!object.Body) {
      return NextResponse.json(
        { error: "Uploaded object not found in storage" },
        { status: 404 },
      );
    }

    const fileBuffer = await streamToBuffer(object.Body);
    const payload = await getPayload({ config });

    const media = await payload.create({
      collection: "media",
      data: {
        alt: body.alt || body.originalName,
      },
      file: {
        data: fileBuffer,
        name: body.originalName,
        mimetype: body.type,
        size: body.size,
      },
    });

    return NextResponse.json({ success: true, mediaId: media.id });
  } catch (error) {
    console.error("Error registering uploaded media:", error);
    return NextResponse.json(
      { error: "Failed to register uploaded media" },
      { status: 500 },
    );
  }
}
