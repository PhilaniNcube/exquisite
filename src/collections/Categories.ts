import type { CollectionConfig } from "payload";
import { anyone } from "./Users/access/anyone";
import editor from "./Users/access/editor";
import admin from "./Users/access/admin";

const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
  },
  access: {
    create: admin,
    read: anyone,
    update: editor,
    delete: admin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Category Name",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      admin: {
        description: "A unique identifier for the category, used in URLs.",
      },
      // hooks: {
      //     beforeChange: [
      //         ({data}) => {
      //             if(data?.name) {
      //                 data.slug = data.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '');
      //             }
      //             return data;
      //         },
      //     ],
      // },
    },
    {
      name: "description",
      type: "textarea",
      label: "Description",
      required: true,
    },
    {
      name: "image",
      type: "upload",
      label: "Image",
      required: true,
      admin: {
        description: "Upload an image for the category.",
      },
      relationTo: "media",
    },
   
  ],
};

export default Categories;
