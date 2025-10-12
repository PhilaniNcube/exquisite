
import { getAuthState } from "@/lib/auth-state";

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, token } = await getAuthState();

  console.log("PAYLOAD TOKEN:", token);
  console.log("IS LOGGED IN:", isLoggedIn);


  return <div>{children}</div>;
}
