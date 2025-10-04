"use server";

import { getPayload } from "payload";
import config from "@payload-config";

interface CreateParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface Response {
  success: boolean;
  error?: string;
}

export async function createAccount({
  email,
  password,
  firstName,
  lastName,
}: CreateParams): Promise<Response> {
  const payload = await getPayload({ config });

  try {
    const find = await payload.find({
      collection: "users",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (find.totalDocs === 0) {
      try {
        await payload.create({
          collection: "users",
          data: {
            email,
            password,
            firstName: firstName || "",
            lastName: lastName || "",
          },
        });

        return { success: true };
      } catch (error) {
        console.error(error);
        return {
          success: false,
          error: "There was an error creating your account. Please try again.",
        };
      }
    } else {
      return {
        success: false,
        error: "An account with that email already exists.",
      };
    }
  } catch (e) {
    console.error(e);
    return {
      success: false,
      error: "There was an error creating your account. Please try again.",
    };
  }
}
