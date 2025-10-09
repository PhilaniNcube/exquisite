import { CollectionConfig } from "payload";
import editor from "../Users/access/editor";
import { FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    read: () => true,
    create: editor,
    update: editor,
    delete: editor,
  },
  admin: {
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      label: "Product Title",
    },
    {
      name: "price",
      type: "number",
      required: true,
      label: "Product Price",
    },
    {
      name: "description",
      label: "Product Description (Includes)",
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
      }),
    },
    {
      name: "image",
      type: "relationship",
      relationTo: "media",
      required: true,
      label: "Product Image",
    },
  ],
};
