import { getUser } from "@/lib/auth";
import { getAuthState } from "@/lib/auth-state";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, token } = await getAuthState();

  console.log("PAYLOAD TOKEN:", token);
  console.log("IS LOGGED IN:", isLoggedIn);

  const user = await getUser();
  console.log("TEMPLATE USER:", user);

  return <div>{children}</div>;
}
