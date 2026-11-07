import { getPayload, type Where } from "payload";
import config from "@payload-config";

export type PhotoDeletionRequestStatus =
  | "pending"
  | "in_review"
  | "approved"
  | "rejected"
  | "completed";

interface GetPhotoDeletionRequestsOptions {
  status?: string;
  page?: number;
  limit?: number;
}

export const getPhotoDeletionRequests = async (
  options: GetPhotoDeletionRequestsOptions = {}
) => {
  const payload = await getPayload({ config });

  const where: Where = {};
  if (options.status && options.status !== "all") {
    where.status = { equals: options.status };
  }

  const requests = await payload.find({
    collection: "photoDeletionRequests",
    ...(Object.keys(where).length > 0 ? { where } : {}),
    sort: "-createdAt",
    page: options.page ?? 1,
    limit: options.limit ?? 20,
    depth: 2,
    overrideAccess: true,
  });

  return requests;
};
