"use server";

import { getPayload } from "payload";
import config from "@payload-config";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export async function logoutAction() {
  // delete the cookie
  const cookieStore = await cookies();
  cookieStore.delete("payload-token");
  revalidatePath("/", "layout");
  redirect("/");
}
