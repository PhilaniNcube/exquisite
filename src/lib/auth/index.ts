

import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import configPromise from "@payload-config";
import type { Customer } from "@/payload-types";
import type { Payload } from "payload";
import { cache } from "react";

const getUser = cache(async (): Promise<Customer | null> => {
  const headers = await getHeaders();
  const payload: Payload = await getPayload({ config: await configPromise });

  const { user } = await payload.auth({ headers });

  if (user?.collection === "customers") {
    return user || null;
  }

  return null;
})

const signOut = async () => {
  const headers = await getHeaders();
  const payload: Payload = await getPayload({ config: await configPromise });
  await payload.auth({ headers });
}


export { getUser };
