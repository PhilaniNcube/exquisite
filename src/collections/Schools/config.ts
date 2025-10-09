import { CollectionConfig } from "payload";
import editor from "../Users/access/editor";

export const Schools: CollectionConfig = {
  slug: "schools",
    access: {
    read: () => true,
    create: editor,
    update: editor,
    delete: editor,
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
  ],
};
