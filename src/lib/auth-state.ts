
import { cookies } from "next/headers";
import { cache } from "react";

export const getAuthState = cache(async () => {
  const cookieStore = await cookies();
  const payloadToken = cookieStore.get("payload-token");
  const isLoggedIn = !!payloadToken?.value;
  
  return {
    isLoggedIn,
    token: payloadToken?.value || null
  };
});
