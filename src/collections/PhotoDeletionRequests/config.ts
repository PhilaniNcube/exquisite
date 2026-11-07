import type { CollectionConfig } from "payload";
import admin from "../Users/access/admin";
import editor from "../Users/access/editor";

/**
 * Requests from parents/guardians to remove photos of their children from the
 * public school gallery. Requests are created by a server action, so the
 * public REST create endpoint is disabled; all mutations go through audited
 * server actions instead.
 */
export const PhotoDeletionRequests: CollectionConfig = {
  slug: "photoDeletionRequests",
  labels: {
    singular: "Photo Removal Request",
    plural: "Photo Removal Requests",
  },
  admin: {
    useAsTitle: "reference",
    defaultColumns: [
      "reference",
      "status",
      "parentName",
      "parentEmail",
      "childNames",
      "createdAt",
    ],
    group: "School Management",
  },
  access: {
    // Created only via the server action with overrideAccess.
    create: () => false,
    read: editor,
    update: editor,
    delete: admin,
  },
  fields: [
    {
      name: "reference",
      type: "text",
      label: "Reference",
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "status",
      type: "select",
      label: "Status",
      required: true,
      defaultValue: "pending",
      options: [
        { label: "Pending review", value: "pending" },
        { label: "In review", value: "in_review" },
        { label: "Approved — photos hidden", value: "approved" },
        { label: "Rejected — photos restored", value: "rejected" },
        { label: "Completed", value: "completed" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "parentName",
      type: "text",
      label: "Parent / Guardian Name",
      required: true,
    },
    {
      name: "parentEmail",
      type: "email",
      label: "Parent / Guardian Email",
      required: true,
    },
    {
      name: "parentPhone",
      type: "text",
      label: "Parent / Guardian Phone",
    },
    {
      name: "relationship",
      type: "select",
      label: "Relationship to Child",
      required: true,
      defaultValue: "Parent",
      options: ["Parent", "Guardian", "Other"],
    },
    {
      name: "orderNumber",
      type: "text",
      label: "Order Number",
      admin: {
        description: "Optional — helps us verify the requester faster.",
      },
    },
    {
      name: "childNames",
      type: "text",
      label: "Child / Children Names",
      required: true,
    },
    {
      name: "school",
      type: "relationship",
      relationTo: "schools",
      required: true,
    },
    {
      name: "class",
      type: "relationship",
      relationTo: "classes",
    },
    {
      name: "photos",
      type: "relationship",
      relationTo: "schoolPhotos",
      hasMany: true,
      required: true,
    },
    {
      name: "photoSnapshot",
      type: "json",
      label: "Photo Snapshot",
      admin: {
        readOnly: true,
        description:
          "Photo names and types captured when the request was submitted.",
      },
    },
    {
      name: "requestType",
      type: "select",
      label: "Request Type",
      required: true,
      defaultValue: "selected_photos",
      options: [
        { label: "Selected photos", value: "selected_photos" },
        { label: "All photos of my child", value: "all_child_photos" },
        {
          label: "Remove my child from group photos",
          value: "group_photo_exclusion",
        },
      ],
    },
    {
      name: "reason",
      type: "textarea",
      label: "Reason / Details",
    },
    {
      name: "declaration",
      type: "checkbox",
      label: "Parent / guardian declaration accepted",
      required: true,
    },
    {
      name: "adminNotes",
      type: "textarea",
      label: "Admin Notes",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "reviewedBy",
      type: "relationship",
      relationTo: "users",
      label: "Reviewed By",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "reviewedAt",
      type: "date",
      label: "Reviewed At",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "completedAt",
      type: "date",
      label: "Completed At",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "requesterIp",
      type: "text",
      label: "Requester IP",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
    {
      name: "requesterUserAgent",
      type: "text",
      label: "Requester User Agent",
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
  ],
};
