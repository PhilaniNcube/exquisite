import { getPayload } from "payload";
import config from "@payload-config";
import { redirect } from "next/navigation";

interface SearchParams {
  [key: string]: string;
}

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { token } = await searchParams;

  const payload = await getPayload({ config });

  if (!token) {
    redirect(`/login?message=${encodeURIComponent("No token provided")}`);
  } else {
    const result = await payload.verifyEmail({
      collection: "customers",
      token,
    });

    if (result) {
      redirect(
        `/login?message=${encodeURIComponent(
          "Email verified successfully. Please log in."
        )}`
      );
    }
  }
}
