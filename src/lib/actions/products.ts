"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { revalidatePath } from "next/cache";

export async function updateProductTitle(productId: number, title: string) {
  try {
    const payload = await getPayload({ config });
    
    const updatedProduct = await payload.update({
      collection: "products",
      id: productId,
      data: {
        title,
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${productId}`);
    
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Error updating product title:", error);
    return { success: false, error: "Failed to update product title" };
  }
}

export async function updateProductPrice(productId: number, price: number) {
  try {
    const payload = await getPayload({ config });
    
    const updatedProduct = await payload.update({
      collection: "products",
      id: productId,
      data: {
        price,
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${productId}`);
    
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Error updating product price:", error);
    return { success: false, error: "Failed to update product price" };
  }
}

export async function updateProductImage(productId: number, imageId: number) {
  try {
    const payload = await getPayload({ config });
    
    const updatedProduct = await payload.update({
      collection: "products",
      id: productId,
      data: {
        image: imageId,
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${productId}`);
    
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Error updating product image:", error);
    return { success: false, error: "Failed to update product image" };
  }
}

export async function updateProductDetails(
  productId: number,
  productDetails: any
) {
  try {
    const payload = await getPayload({ config });
    
    const updatedProduct = await payload.update({
      collection: "products",
      id: productId,
      data: {
        productDetails,
      },
    });

    revalidatePath("/dashboard/products");
    revalidatePath(`/dashboard/products/${productId}`);
    
    return { success: true, product: updatedProduct };
  } catch (error) {
    console.error("Error updating product details:", error);
    return { success: false, error: "Failed to update product details" };
  }
}

export async function uploadProductImage(formData: FormData) {
  try {
    const payload = await getPayload({ config });
    const file = formData.get("file") as File;
    
    if (!file) {
      return { success: false, error: "No file provided" };
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const media = await payload.create({
      collection: "media",
      data: {
        alt: file.name,
      },
      file: {
        data: buffer,
        mimetype: file.type,
        name: file.name,
        size: file.size,
      },
    });

    return { success: true, media };
  } catch (error) {
    console.error("Error uploading image:", error);
    return { success: false, error: "Failed to upload image" };
  }
}
