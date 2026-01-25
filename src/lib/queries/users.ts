import { getPayload } from "payload";
import config from "@payload-config";
import { User } from "@/payload-types";

export async function getUsers({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}) {
  const payload = await getPayload({ config });

  const users = await payload.find({
    collection: "users",
    limit,
    page,
    sort: "-createdAt",
  });

  return users;
}

export async function getUserById(id: number) {
  const payload = await getPayload({ config });

  const user = await payload.findByID({
    collection: "users",
    id,
  });

  return user;
}
