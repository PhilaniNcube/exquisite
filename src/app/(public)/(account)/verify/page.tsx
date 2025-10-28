import { getPayload } from "payload";
import config from "@payload-config";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface SearchParams {
  [key: string]: string;
}

const VerifyContent = async ({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) => {
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

  return null;
};

export default function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  return (
    <Suspense fallback={<div>Verifying email...</div>}>
      <VerifyContent searchParams={searchParams} />
    </Suspense>
  );
}
