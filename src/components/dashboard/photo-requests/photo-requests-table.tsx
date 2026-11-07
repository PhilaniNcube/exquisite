"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Check, Loader2, RotateCcw, Search, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type {
  Media,
  PhotoDeletionRequest,
  SchoolPhoto,
} from "@/payload-types";
import {
  approvePhotoDeletionRequest,
  markPhotoDeletionRequestInReview,
  rejectPhotoDeletionRequest,
} from "@/lib/actions/photo-removal-admin";

const statusStyles: Record<PhotoDeletionRequest["status"], string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  in_review: "bg-blue-100 text-blue-800 border-blue-200",
  approved: "bg-green-100 text-green-800 border-green-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-slate-100 text-slate-800 border-slate-200",
};

const statusLabels: Record<PhotoDeletionRequest["status"], string> = {
  pending: "Pending review",
  in_review: "In review",
  approved: "Approved — hidden",
  rejected: "Rejected — restored",
  completed: "Completed",
};

function getSchoolName(request: PhotoDeletionRequest) {
  return typeof request.school === "object" && request.school
    ? request.school.name
    : `School #${request.school}`;
}

function getClassName(request: PhotoDeletionRequest) {
  if (!request.class) return null;
  return typeof request.class === "object" ? request.class.name : `Class #${request.class}`;
}

function getPhotoMedia(photo: SchoolPhoto) {
  return typeof photo.photo === "object" ? (photo.photo as Media) : null;
}

function PhotoThumbnails({ photos }: { photos: PhotoDeletionRequest["photos"] }) {
  if (!photos || photos.length === 0) {
    return <p className="text-sm text-muted-foreground">No photos recorded.</p>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {photos.map((photo) => {
        if (typeof photo !== "object" || photo === null) {
          return (
            <div
              key={`photo-${photo}`}
              className="flex h-20 w-20 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground"
            >
              #{photo}
            </div>
          );
        }

        const media = getPhotoMedia(photo);
        const imageUrl =
          media?.sizes?.thumbnail?.url || media?.sizes?.card?.url || media?.url;

        return (
          <div key={photo.id} className="w-24 space-y-1">
            <div className="relative aspect-square overflow-hidden rounded-md border bg-muted">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={photo.name || `Photo ${photo.id}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                  No image
                </div>
              )}
            </div>
            <p className="truncate text-xs font-medium" title={photo.name}>
              #{photo.id} {photo.name}
            </p>
            {photo.photoType ? (
              <p className="text-[11px] text-muted-foreground">{photo.photoType}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function RequestActions({ request }: { request: PhotoDeletionRequest }) {
  const [note, setNote] = useState(request.adminNotes || "");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const runAction = (
    action: () => Promise<{ success: true } | { success: false; error: string }>,
    successMessage: string
  ) => {
    startTransition(async () => {
      const result = await action();
      if (result.success) {
        toast.success(successMessage);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  if (request.status === "approved" || request.status === "rejected" || request.status === "completed") {
    return request.adminNotes ? (
      <div className="rounded-md border bg-muted/40 p-3 text-sm">
        <p className="font-medium">Admin notes</p>
        <p className="text-muted-foreground whitespace-pre-wrap">{request.adminNotes}</p>
      </div>
    ) : null;
  }

  return (
    <div className="space-y-3">
      <Textarea
        value={note}
        onChange={(event) => setNote(event.target.value)}
        placeholder="Add an internal note for this request (optional)..."
        rows={2}
        disabled={isPending}
      />
      <div className="flex flex-wrap gap-2">
        {request.status === "pending" && (
          <Button
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={() =>
              runAction(
                () => markPhotoDeletionRequestInReview(request.id, note || undefined),
                "Request marked as in review."
              )
            }
          >
            <Search className="mr-2 h-4 w-4" />
            Start review
          </Button>
        )}

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" disabled={isPending}>
              <Check className="mr-2 h-4 w-4" />
              Approve & keep hidden
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Approve this removal request?</AlertDialogTitle>
              <AlertDialogDescription>
                The photos will stay hidden from the public gallery and ordering
                flow. Order records that reference them are preserved.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={() =>
                  runAction(
                    () => approvePhotoDeletionRequest(request.id, note || undefined),
                    "Request approved. Photos remain hidden."
                  )
                }
              >
                Approve
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={isPending}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reject & restore
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reject this removal request?</AlertDialogTitle>
              <AlertDialogDescription>
                The photos will be restored to the public gallery. Make sure
                the requester has been informed if appropriate.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={() =>
                  runAction(
                    () => rejectPhotoDeletionRequest(request.id, note || undefined),
                    "Request rejected. Photos restored."
                  )
                }
              >
                Reject
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {isPending && (
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Updating...
          </span>
        )}
      </div>
    </div>
  );
}

export function PhotoRequestsTable({ requests }: { requests: PhotoDeletionRequest[] }) {
  if (requests.length === 0) {
    return (
      <div className="rounded-lg border bg-card py-16 text-center text-muted-foreground">
        <ShieldAlert className="mx-auto mb-3 h-10 w-10 opacity-40" />
        No photo removal requests found for this filter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => {
        const className = getClassName(request);

        return (
          <div key={request.id} className="rounded-lg border bg-card shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3 border-b p-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold">{request.reference}</span>
                  <Badge
                    variant="outline"
                    className={statusStyles[request.status]}
                  >
                    {statusLabels[request.status]}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Submitted {format(new Date(request.createdAt), "PPp")}
                </p>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium">{request.childNames}</p>
                <p className="text-muted-foreground">
                  {getSchoolName(request)}
                  {className ? ` · ${className}` : ""}
                </p>
              </div>
            </div>

            <div className="grid gap-4 p-4 md:grid-cols-2">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-muted-foreground">Parent:</span>{" "}
                  {request.parentName} ({request.relationship})
                </p>
                <p>
                  <span className="text-muted-foreground">Email:</span>{" "}
                  <a className="underline underline-offset-2" href={`mailto:${request.parentEmail}`}>
                    {request.parentEmail}
                  </a>
                </p>
                {request.parentPhone && (
                  <p>
                    <span className="text-muted-foreground">Phone:</span>{" "}
                    {request.parentPhone}
                  </p>
                )}
                {request.orderNumber && (
                  <p>
                    <span className="text-muted-foreground">Order number:</span>{" "}
                    {request.orderNumber}
                  </p>
                )}
                <p>
                  <span className="text-muted-foreground">Request type:</span>{" "}
                  {request.requestType === "selected_photos"
                    ? "Selected photos"
                    : request.requestType === "all_child_photos"
                      ? "All photos of my child"
                      : "Remove child from group photos"}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-medium">Reason / details</p>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {request.reason || "No reason provided."}
                </p>
                {request.reviewedAt && (
                  <>
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground">
                      Reviewed {format(new Date(request.reviewedAt), "PPp")}
                      {request.reviewedBy && typeof request.reviewedBy === "object"
                        ? ` by ${request.reviewedBy.firstName} ${request.reviewedBy.lastName}`
                        : ""}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="border-t p-4">
              <p className="mb-3 text-sm font-medium">Photos requested for removal</p>
              <PhotoThumbnails photos={request.photos} />
            </div>

            <div className="border-t p-4">
              <RequestActions request={request} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
