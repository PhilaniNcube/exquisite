"use server";

import crypto from "crypto";
import { headers } from "next/headers";
import { revalidatePath, revalidateTag } from "next/cache";
import { getPayload } from "payload";
import { z } from "zod";
import config from "@payload-config";
import { sendPhotoRemovalRequestEmails } from "@/lib/email/photo-removal-notifications";

const requestSchema = z.object({
  parentName: z.string().min(2, "Please enter your full name."),
  parentEmail: z.string().email("Please enter a valid email address."),
  parentPhone: z.string().max(50).optional(),
  relationship: z.enum(["Parent", "Guardian", "Other"]),
  orderNumber: z.string().max(50).optional(),
  childNames: z.string().min(2, "Please enter the child or children's names."),
  reason: z.string().max(2000).optional(),
  declaration: z
    .boolean()
    .refine((value) => value === true, "Please confirm the parent/guardian declaration."),
  website: z.string().optional(),
});

export interface PhotoDeletionRequestInput {
  parentName: string;
  parentEmail: string;
  parentPhone?: string;
  relationship: "Parent" | "Guardian" | "Other";
  orderNumber?: string;
  childNames: string;
  reason?: string;
  declaration: boolean;
  website?: string;
  photoIds: Array<number | string>;
  schoolId: number | string;
  classId?: number | string | null;
}

export type PhotoDeletionRequestResult =
  | { success: true; reference: string }
  | { success: false; error: string };

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === "") return null;
  const parsed = typeof value === "number" ? value : Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : null;
}

export async function submitPhotoDeletionRequest(
  input: PhotoDeletionRequestInput
): Promise<PhotoDeletionRequestResult> {
  try {
    const parsed = requestSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Please check the form and try again.",
      };
    }

    // Honeypot: real users never fill this hidden field.
    if (parsed.data.website) {
      return { success: false, error: "Unable to submit this request." };
    }

    const schoolId = toNumber(input.schoolId);
    if (!schoolId) {
      return { success: false, error: "Invalid school." };
    }

    const classId = toNumber(input.classId);
    const photoIds = Array.from(
      new Set(
        (input.photoIds ?? [])
          .map((photoId) => toNumber(photoId))
          .filter((photoId): photoId is number => photoId !== null)
      )
    );

    if (photoIds.length === 0) {
      return { success: false, error: "Please select at least one photo." };
    }

    const payload = await getPayload({ config });

    const photosResult = await payload.find({
      collection: "schoolPhotos",
      where: { id: { in: photoIds } },
      depth: 1,
      limit: photoIds.length,
      overrideAccess: true,
    });

    if (photosResult.docs.length !== photoIds.length) {
      return {
        success: false,
        error: "One or more photos could not be found. Please refresh the gallery and try again.",
      };
    }

    for (const photo of photosResult.docs) {
      const photoSchool =
        typeof photo.schoolDetails?.school === "object" && photo.schoolDetails?.school
          ? photo.schoolDetails.school.id
          : photo.schoolDetails?.school;

      if (Number(photoSchool) !== schoolId) {
        return {
          success: false,
          error: "The selected photos do not belong to this school.",
        };
      }

      if ((photo.visibility ?? "public") !== "public") {
        return {
          success: false,
          error:
            "One or more selected photos are already hidden or pending review. Please refresh the gallery.",
        };
      }
    }

    const existingRequest = await payload.find({
      collection: "photoDeletionRequests",
      where: {
        photos: { in: photoIds },
        status: { in: ["pending", "in_review", "approved"] },
      },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    if (existingRequest.docs.length > 0) {
      return {
        success: false,
        error: `A removal request already exists for these photos (reference ${existingRequest.docs[0].reference}).`,
      };
    }

    const requestHeaders = await headers();
    const forwardedFor = requestHeaders.get("x-forwarded-for");
    const requesterIp =
      forwardedFor?.split(",")[0]?.trim() ||
      requestHeaders.get("x-real-ip") ||
      "unknown";
    const requesterUserAgent = requestHeaders.get("user-agent") || "";

    // Simple abuse guard: no more than 3 requests per email/IP in 10 minutes.
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    const recentRequests = await payload.find({
      collection: "photoDeletionRequests",
      where: {
        or: [
          { parentEmail: { equals: parsed.data.parentEmail.trim().toLowerCase() } },
          { requesterIp: { equals: requesterIp } },
        ],
        createdAt: { greater_than_equal: tenMinutesAgo },
      },
      limit: 5,
      depth: 0,
      overrideAccess: true,
    });

    if (recentRequests.docs.length >= 3) {
      return {
        success: false,
        error: "Too many requests. Please wait a few minutes and try again.",
      };
    }

    const reference = `PDR-${new Date().getFullYear()}-${crypto
      .randomUUID()
      .replace(/-/g, "")
      .slice(0, 6)
      .toUpperCase()}`;

    const photoSnapshot = photosResult.docs.map((photo) => ({
      id: photo.id,
      name: photo.name,
      photoType: photo.photoType ?? null,
      studentName: photo.studentName ?? null,
    }));

    const request = await payload.create({
      collection: "photoDeletionRequests",
      overrideAccess: true,
      data: {
        reference,
        status: "pending",
        parentName: parsed.data.parentName.trim(),
        parentEmail: parsed.data.parentEmail.trim().toLowerCase(),
        parentPhone: parsed.data.parentPhone?.trim() || undefined,
        relationship: parsed.data.relationship,
        orderNumber: parsed.data.orderNumber?.trim() || undefined,
        childNames: parsed.data.childNames.trim(),
        school: schoolId,
        class: classId ?? undefined,
        photos: photoIds,
        photoSnapshot,
        requestType: "selected_photos",
        reason: parsed.data.reason?.trim() || undefined,
        declaration: true,
        requesterIp,
        requesterUserAgent,
      },
    });

    // Immediately soft-hide the photos while the request is reviewed.
    await Promise.all(
      photoIds.map((photoId) =>
        payload.update({
          collection: "schoolPhotos",
          id: photoId,
          data: { visibility: "pending_removal" },
          overrideAccess: true,
        })
      )
    );

    try {
      await sendPhotoRemovalRequestEmails({
        request,
        photos: photosResult.docs,
      });
    } catch (emailError) {
      // The request is already recorded; email failure should not fail it.
      console.error("Failed to send photo removal request emails:", emailError);
    }

    revalidatePath(`/schools/${schoolId}`);
    revalidatePath("/dashboard/photo-requests");
    revalidatePath("/dashboard/school-photos");
    revalidatePath(`/dashboard/schools/${schoolId}`);
    if (classId) {
      revalidatePath(`/dashboard/classes/${classId}`);
    }
    for (const photoId of photoIds) {
      revalidatePath(`/school-photos/${photoId}`);
      revalidateTag(`school-photo-${photoId}`, "max");
    }
    revalidatePath("/products", "layout");

    return { success: true, reference };
  } catch (error) {
    console.error("Photo deletion request error:", error);
    return {
      success: false,
      error: "Unable to submit your request right now. Please try again later.",
    };
  }
}
