"use server";

import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { getPayload } from "payload";
import config from "@payload-config";
import { checkRole } from "@/collections/Users/access/checkRole";
import type { PhotoDeletionRequest, SchoolPhoto, User } from "@/payload-types";

type ActionResult = { success: true } | { success: false; error: string };

async function getAuthorizedPayload() {
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: await headers() });

  if (
    user?.collection !== "users" ||
    !checkRole(["admin", "editor"], user as User)
  ) {
    return null;
  }

  return { payload, user: user as User };
}

function idFromRelationship(
  value: number | { id: number } | null | undefined
): number | null {
  if (!value) return null;
  return typeof value === "object" ? value.id : value;
}

function photoIdsFromRequest(request: PhotoDeletionRequest) {
  return (request.photos ?? [])
    .map((photo) => idFromRelationship(photo))
    .filter((id): id is number => id !== null);
}

function revalidateRequestView(
  request: PhotoDeletionRequest,
  photoIds: number[]
) {
  const schoolId = idFromRelationship(request.school);
  const classId = idFromRelationship(request.class);

  revalidatePath("/dashboard/photo-requests");
  revalidatePath("/dashboard/school-photos");

  if (schoolId) {
    revalidatePath(`/schools/${schoolId}`);
    revalidatePath(`/dashboard/schools/${schoolId}`);
  }

  if (classId) {
    revalidatePath(`/dashboard/classes/${classId}`);
  }

  for (const photoId of photoIds) {
    revalidatePath(`/school-photos/${photoId}`);
    revalidateTag(`school-photo-${photoId}`, "max");
  }

  // Product pages cache school-photo lists, so invalidate the product layout.
  revalidatePath("/products", "layout");
}

async function loadRequest(
  payload: Awaited<ReturnType<typeof getPayload>>,
  requestId: number
) {
  try {
    return await payload.findByID({
      collection: "photoDeletionRequests",
      id: requestId,
      depth: 0,
      overrideAccess: true,
    });
  } catch {
    return null;
  }
}

async function updatePhotoVisibility(
  payload: Awaited<ReturnType<typeof getPayload>>,
  photoIds: number[],
  fromVisibilities: SchoolPhoto["visibility"][],
  toVisibility: SchoolPhoto["visibility"]
) {
  if (photoIds.length === 0) return;

  const photos = await payload.find({
    collection: "schoolPhotos",
    where: { id: { in: photoIds } },
    limit: photoIds.length,
    depth: 0,
    overrideAccess: true,
  });

  await Promise.all(
    photos.docs
      .filter((photo) => fromVisibilities.includes(photo.visibility))
      .map((photo) =>
        payload.update({
          collection: "schoolPhotos",
          id: photo.id,
          data: { visibility: toVisibility },
          overrideAccess: true,
        })
      )
  );
}

export async function markPhotoDeletionRequestInReview(
  requestId: number,
  adminNotes?: string
): Promise<ActionResult> {
  const auth = await getAuthorizedPayload();
  if (!auth) return { success: false, error: "Unauthorized." };

  const { payload, user } = auth;
  const request = await loadRequest(payload, requestId);
  if (!request) return { success: false, error: "Request not found." };

  if (request.status === "approved" || request.status === "rejected") {
    return { success: false, error: "This request has already been reviewed." };
  }

  await payload.update({
    collection: "photoDeletionRequests",
    id: requestId,
    overrideAccess: true,
    data: {
      status: "in_review",
      reviewedBy: user.id,
      reviewedAt: new Date().toISOString(),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    },
  });

  revalidatePath("/dashboard/photo-requests");
  return { success: true };
}

export async function approvePhotoDeletionRequest(
  requestId: number,
  adminNotes?: string
): Promise<ActionResult> {
  const auth = await getAuthorizedPayload();
  if (!auth) return { success: false, error: "Unauthorized." };

  const { payload, user } = auth;
  const request = await loadRequest(payload, requestId);
  if (!request) return { success: false, error: "Request not found." };

  if (request.status === "approved") {
    return { success: false, error: "This request is already approved." };
  }
  if (request.status === "rejected") {
    return {
      success: false,
      error: "This request was rejected. Restore it to review before approving.",
    };
  }

  const photoIds = photoIdsFromRequest(request);

  // Hide photos that are still pending removal. Already-hidden photos stay
  // hidden; photos restored elsewhere are left untouched.
  await updatePhotoVisibility(payload, photoIds, ["pending_removal"], "hidden");

  const now = new Date().toISOString();
  await payload.update({
    collection: "photoDeletionRequests",
    id: requestId,
    overrideAccess: true,
    data: {
      status: "approved",
      reviewedBy: user.id,
      reviewedAt: now,
      completedAt: now,
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    },
  });

  revalidateRequestView(request, photoIds);
  return { success: true };
}

export async function rejectPhotoDeletionRequest(
  requestId: number,
  adminNotes?: string
): Promise<ActionResult> {
  const auth = await getAuthorizedPayload();
  if (!auth) return { success: false, error: "Unauthorized." };

  const { payload, user } = auth;
  const request = await loadRequest(payload, requestId);
  if (!request) return { success: false, error: "Request not found." };

  if (request.status === "rejected") {
    return { success: false, error: "This request is already rejected." };
  }

  const photoIds = photoIdsFromRequest(request);

  // Restore photos that were hidden specifically because of this request.
  // An approved request can be reversed, so hidden photos are restored too.
  await updatePhotoVisibility(
    payload,
    photoIds,
    ["pending_removal", "hidden"],
    "public"
  );

  await payload.update({
    collection: "photoDeletionRequests",
    id: requestId,
    overrideAccess: true,
    data: {
      status: "rejected",
      reviewedBy: user.id,
      reviewedAt: new Date().toISOString(),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    },
  });

  revalidateRequestView(request, photoIds);
  return { success: true };
}
