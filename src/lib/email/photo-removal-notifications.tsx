import { Resend } from "resend";
import type { PhotoDeletionRequest, SchoolPhoto } from "@/payload-types";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromAddress =
  process.env.FROM_EMAIL || "este@exquisitephoto.co.za";
const adminAddress =
  process.env.ADMIN_EMAIL ||
  process.env.FROM_EMAIL ||
  "este@exquisitephoto.co.za";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXT_PUBLIC_SERVER_URL ||
  "";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character] ?? character;
  });
}

function getSchoolName(request: PhotoDeletionRequest) {
  return typeof request.school === "object" && request.school
    ? request.school.name
    : `School #${request.school}`;
}

function getClassName(request: PhotoDeletionRequest) {
  if (!request.class) return null;
  return typeof request.class === "object" ? request.class.name : `Class #${request.class}`;
}

function getPhotoList(photos: SchoolPhoto[]) {
  return photos
    .map(
      (photo) =>
        `<li style="margin-bottom:6px;">#${photo.id} — ${escapeHtml(photo.name)}${
          photo.photoType ? ` (${escapeHtml(photo.photoType)})` : ""
        }</li>`
    )
    .join("");
}

function getPhotoNames(request: PhotoDeletionRequest, photos: SchoolPhoto[]) {
  if (photos.length > 0) return getPhotoList(photos);

  const snapshot = request.photoSnapshot;
  if (Array.isArray(snapshot)) {
    return snapshot
      .map((item) => {
        if (item && typeof item === "object" && "name" in item) {
          const record = item as { id?: unknown; name?: unknown; photoType?: unknown };
          return `<li style="margin-bottom:6px;">#${String(record.id ?? "")} — ${escapeHtml(
            String(record.name ?? "Untitled")
          )}${record.photoType ? ` (${escapeHtml(String(record.photoType))})` : ""}</li>`;
        }
        return "";
      })
      .join("");
  }

  return "<li>Photo details unavailable</li>";
}

export async function sendPhotoRemovalRequestEmails({
  request,
  photos,
}: {
  request: PhotoDeletionRequest;
  photos: SchoolPhoto[];
}) {
  if (!resend) {
    console.warn(
      "RESEND_API_KEY is not configured. Skipping photo removal request emails."
    );
    return;
  }

  const schoolName = getSchoolName(request);
  const className = getClassName(request);
  const photoList = getPhotoNames(request, photos);
  const adminUrl = `${siteUrl}/dashboard/photo-requests`;
  const detailsRows = [
    ["Reference", request.reference],
    ["Parent / guardian", request.parentName],
    ["Email", request.parentEmail],
    ["Phone", request.parentPhone || "Not provided"],
    ["Relationship", request.relationship],
    ["Child / children", request.childNames],
    ["School", schoolName],
    ["Class", className || "Not specified"],
    ["Order number", request.orderNumber || "Not provided"],
    ["Reason", request.reason || "Not provided"],
  ]
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#555;vertical-align:top;"><strong>${label}</strong></td><td style="padding:6px 0;">${escapeHtml(
          String(value)
        ).replace(/\n/g, "<br>")}</td></tr>`
    )
    .join("");

  await Promise.all([
    resend.emails.send({
      from: fromAddress,
      to: [adminAddress],
      subject: `Photo removal request ${request.reference} — ${request.childNames}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#222;">
          <h2 style="border-bottom:2px solid #e5e5e5;padding-bottom:10px;">
            New photo removal request
          </h2>
          <p>A parent or guardian has requested removal of the photos below. The photos have been hidden from the public gallery automatically and are waiting for verification.</p>
          <table style="border-collapse:collapse;margin:16px 0;">${detailsRows}</table>
          <h3>Photos requested for removal</h3>
          <ul style="padding-left:20px;">${photoList}</ul>
          <p style="margin-top:24px;">
            <a href="${adminUrl}" style="background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">
              Review in the dashboard
            </a>
          </p>
          <p style="color:#777;font-size:12px;margin-top:24px;">
            Photos are hidden while the request is pending. Approving the request keeps them hidden; rejecting it restores them to the public gallery.
          </p>
        </div>
      `,
      replyTo: request.parentEmail,
    }),
    resend.emails.send({
      from: fromAddress,
      to: [request.parentEmail],
      subject: `We received your photo removal request (${request.reference})`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#222;">
          <h2 style="border-bottom:2px solid #e5e5e5;padding-bottom:10px;">
            We received your request
          </h2>
          <p>Dear ${escapeHtml(request.parentName)},</p>
          <p>Thank you for contacting Exquisite Photography. We have received your request to remove photos of <strong>${escapeHtml(
            request.childNames
          )}</strong> from the ${escapeHtml(schoolName)} gallery.</p>
          <p><strong>Reference:</strong> ${request.reference}</p>
          <p>The photos have been temporarily hidden while we verify the request. We will review it and confirm the outcome by email.</p>
          <h3>Photos included in your request</h3>
          <ul style="padding-left:20px;">${photoList}</ul>
          <p>If you did not make this request, please contact us immediately at <a href="mailto:${adminAddress}">${adminAddress}</a>.</p>
          <p style="color:#777;font-size:12px;margin-top:24px;">
            This is an automated confirmation. Please keep your reference number for any follow-up.
          </p>
        </div>
      `,
    }),
  ]);
}
