import { getPayload } from "payload";
import config from "@payload-config";
import { cookies } from "next/headers";

interface ForgotPasswordParams {
  email: string;
}

interface Response {
  success: boolean;
  error?: string;
}

export async function forgotPassword({
  email,
}: ForgotPasswordParams): Promise<Response> {
  const payload = await getPayload({ config });
  const cookieStore = await cookies();
  try {
    await payload.forgotPassword({
      collection: "customers",
      data: {
        email,
      },
    });

    // Clear any existing payload-token cookie
    cookieStore.delete("payload-token");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error requesting password reset. Please try again.",
    };
  }
  return { success: true };
}
