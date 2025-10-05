import type { CollectionConfig } from "payload";
import editor from "../Users/access/editor";
import admin from "../Users/access/admin";

export const ClientGalleries: CollectionConfig = {
  slug: "client-galleries",
  labels: {
    singular: "Client Gallery",
    plural: "Client Galleries",
  },
  access: {
    read: ({ req }) => {
      if (!req.user) return false;

      if (req.user.collection === "users") {
        // this particular user is from the collection users
        const isAdmin = req.user?.roles?.includes("admin");

        if (isAdmin) {
          return true;
        }

        const isEditor = req.user?.roles?.includes("editor");

        if (isEditor) {
          return true;
        }

        return false;
      }

      // Customers can only read galleries they're associated with
      if (req.user.collection === "customers") {
        return {
          customers: {
            in: [req.user.id],
          },
        };
      }

      return false;
    },
    create: editor,
    update: editor,
    delete: admin
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "customers",
      type: "relationship",
      relationTo: "customers",
      hasMany: true,
      required: true,
      admin: {
        description: "Select customers who have access to this gallery",
      },
    },
    {
      name: "media",
      type: "relationship",
      relationTo: "media",
      hasMany: true,
      admin: {
        description: "Media files included in this gallery",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Gallery is active and accessible to assigned customers",
      },
    },
  ],
  timestamps: true,
};
