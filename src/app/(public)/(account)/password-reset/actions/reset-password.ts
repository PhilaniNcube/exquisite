import { getPayload } from "payload";
import config from "@payload-config";
import { cookies } from "next/headers";

interface ResetPasswordParams {
  password: string;
  token: string;
}
interface Response {
  success: boolean;
  error?: string;
}

export async function resetPassword({
  password,
  token,
}: ResetPasswordParams): Promise<Response> {
  const payload = await getPayload({ config });
  const cookieStore = await cookies();

  try {
    const result = await payload.resetPassword({
      collection: "customers", // required
      data: {
        // required
        password: password, // the new password to set
        token: token, // the token generated from the forgotPassword operation
      },
      overrideAccess: false,
    });

    console.log("Password reset result:", result);

    // Clear any existing payload-token cookie
    cookieStore.delete("payload-token");
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Error resetting password. Please try again.",
    };
  }

  return { success: true };
}
