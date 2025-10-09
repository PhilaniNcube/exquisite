import { CollectionConfig } from "payload";
import editor from "../Users/access/editor";
import { lexicalEditor, FixedToolbarFeature, HeadingFeature, BoldFeature, ItalicFeature, UnderlineFeature } from "@payloadcms/richtext-lexical";

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
      name: "image",
      type: "relationship",
      relationTo: "media",
      required: true,
      label: "Product Image",
    },
    {
        name: "productDetails",
        type: "richText",
        required: true,
        label: "Product Details",
        editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
                ...defaultFeatures,
                FixedToolbarFeature(),
                HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
                BoldFeature(),
                ItalicFeature(),
                UnderlineFeature(),
            ],
        }),
    }
  ],
};
