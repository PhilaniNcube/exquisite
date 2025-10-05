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
      collection: "customers",
      where: {
        email: {
          equals: email,
        },
      },
    });

    if (find.totalDocs === 0) {
      try {
        const newAccount = await payload.create({
          collection: "customers",
          data: {
            email,
            password,
            firstName,
            lastName,
          },
        });

        console.log("New account created:", newAccount);

        return { success: true };
      } catch (error) {
        console.error(JSON.stringify(error, null, 2));
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

