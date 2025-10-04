"use server";

import { getPayload } from "payload";
import config from "@payload-config";

interface LoginParams {
  email: string;
  password: string;
}

interface Response {
  success: boolean;
  error?: string;
}

export async function loginUser({
  email,
  password,
}: LoginParams): Promise<Response> {
  const payload = await getPayload({ config });

  try {
    const result = await payload.login({
      collection: "users",
      data: {
        email,
        password,
      },
    });

    if (result.user) {
      return { success: true };
    } else {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Invalid email or password.",
    };
  }
}
