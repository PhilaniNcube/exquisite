"use client";

import { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SchoolPhoto } from "@/payload-types";
import { submitPhotoDeletionRequest } from "@/lib/actions/photo-removal-requests";

const formSchema = z.object({
  parentName: z.string().min(2, "Please enter your full name."),
  parentEmail: z.string().email("Please enter a valid email address."),
  parentPhone: z.string().optional(),
  relationship: z.enum(["Parent", "Guardian", "Other"]),
  orderNumber: z.string().optional(),
  childNames: z.string().min(2, "Please enter the child or children's names."),
  reason: z.string().max(2000).optional(),
  declaration: z
    .boolean()
    .refine((value) => value === true, "Please confirm the parent/guardian declaration."),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface PhotoRemovalRequestDialogProps {
  photo: SchoolPhoto;
  schoolName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getSchoolInfo(photo: SchoolPhoto, schoolName?: string) {
  const school = photo.schoolDetails?.school;
  const schoolId =
    typeof school === "object" && school ? school.id : school ?? undefined;
  const resolvedSchoolName =
    typeof school === "object" && school
      ? school.name
      : schoolName || (schoolId ? `School #${schoolId}` : "Unknown school");

  return { schoolId, schoolName: resolvedSchoolName };
}

function getClassInfo(photo: SchoolPhoto) {
  const classValue = photo.schoolDetails?.class;
  const classId =
    typeof classValue === "object" && classValue
      ? classValue.id
      : classValue ?? undefined;
  const className =
    typeof classValue === "object" && classValue ? classValue.name : undefined;

  return { classId, className };
}

export function PhotoRemovalRequestDialog({
  photo,
  schoolName,
  open,
  onOpenChange,
}: PhotoRemovalRequestDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { schoolId, schoolName: resolvedSchoolName } = getSchoolInfo(
    photo,
    schoolName
  );
  const { classId, className } = getClassInfo(photo);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: "",
      parentEmail: "",
      parentPhone: "",
      relationship: "Parent",
      orderNumber: "",
      childNames: photo.studentName || "",
      reason: "",
      declaration: false,
      website: "",
    },
  });

  // Reset the form when a different photo is selected.
  useEffect(() => {
    if (!open) return;
    form.reset({
      parentName: form.getValues("parentName"),
      parentEmail: form.getValues("parentEmail"),
      parentPhone: form.getValues("parentPhone"),
      relationship: form.getValues("relationship"),
      orderNumber: form.getValues("orderNumber"),
      childNames: photo.studentName || "",
      reason: "",
      declaration: false,
      website: "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, photo.id]);

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const result = await submitPhotoDeletionRequest({
        ...values,
        photoIds: [photo.id],
        schoolId: schoolId ?? 0,
        classId: classId ?? null,
      });

      if (result.success) {
        toast.success(
          `Request ${result.reference} submitted. The photo is hidden while we review it.`
        );
        onOpenChange(false);
        router.refresh();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-amber-600" />
            Request photo removal
          </DialogTitle>
          <DialogDescription>
            Tell us which child the photo belongs to. The photo will be hidden
            from the public gallery while we verify your request.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-md border bg-muted/40 p-3 text-sm">
          <p className="font-medium">{photo.name || "Untitled photo"}</p>
          <p className="text-muted-foreground">
            {resolvedSchoolName}
            {className ? ` · ${className}` : ""} · Photo #{photo.id}
          </p>
          {photo.studentName ? (
            <p className="text-muted-foreground">
              Student on record: {photo.studentName}
            </p>
          ) : null}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="parentName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your full name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address *</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone number</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="relationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship to child *</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Parent">Parent</SelectItem>
                        <SelectItem value="Guardian">Guardian</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="childNames"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Child / children names *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Sarah Smith"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Include all children whose photos should be removed.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="orderNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order number (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 1042" {...field} />
                  </FormControl>
                  <FormDescription>
                    Helps us verify your request faster.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason / details</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={3}
                      placeholder="Tell us why you would like this photo removed."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Honeypot — hidden from real users */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="photo-removal-website">Website</label>
              <Input
                id="photo-removal-website"
                tabIndex={-1}
                autoComplete="off"
                {...form.register("website")}
              />
            </div>

            <FormField
              control={form.control}
              name="declaration"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-3 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                  </FormControl>
                  <div className="space-y-1 leading-tight">
                    <FormLabel className="cursor-pointer">
                      I confirm that I am the parent or legal guardian of the
                      child named above and that I am authorised to make this
                      request. *
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <p className="text-xs text-muted-foreground">
              We process requests in line with our{" "}
              <a href="/privacy" className="underline underline-offset-2">
                privacy policy
              </a>
              . The photo is hidden immediately and will be permanently removed
              or restored after review.
            </p>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit request"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
