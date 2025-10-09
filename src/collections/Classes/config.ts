import { CollectionConfig } from "payload";
import editor from "../Users/access/editor";

export const Classes: CollectionConfig = {
  slug: "classes",
  access: {
    read: () => true,
    create: editor,
    update: editor,
    delete: editor,
  },
  admin: {
    useAsTitle: "name",
    enableListViewSelectAPI: true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "school",
      type: "relationship",
      relationTo: "schools",
      required: true,
    },   
  ],
};
