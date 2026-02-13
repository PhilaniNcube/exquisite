import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";

type RegisterUploadedImageBody = {
  productId: number;
  key: string;
  originalName: string;
  type: string;
  size: number;
  alt?: string;
};

function getPublicUrlFromKey(key: string) {
  const baseUrl =
    process.env.S3_DEV_URL!

  return `${baseUrl.replace(/\/$/, "")}/${key}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as RegisterUploadedImageBody;

    if (!body?.productId || !body?.key || !body?.originalName || !body?.type || !body?.size) {
      return NextResponse.json(
        { error: "Invalid register payload" },
        { status: 400 },
      );
    }

    const payload = await getPayload({ config });
    const imageUrl = getPublicUrlFromKey(body.key);

    const media = await payload.create({
      collection: "media",
      data: {
        alt: body.alt || body.originalName,
        url: imageUrl,
        filename: body.key.split("/").pop() || body.originalName,
        mimeType: body.type,
        filesize: body.size,
      },
    });

    await payload.update({
      collection: "products",
      id: body.productId,
      data: {
        image: media.id,
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${body.productId}`);

    return NextResponse.json({ success: true, mediaId: media.id, imageUrl });
  } catch (error) {
    console.error("Error registering uploaded product image:", error);
    return NextResponse.json(
      { error: "Failed to register uploaded image" },
      { status: 500 },
    );
  }
}
