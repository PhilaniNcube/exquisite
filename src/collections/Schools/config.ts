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
    {
      name: "type",
      type: "select",
      options: [
        {
          label: "Creche",
          value: "creche",
        },
        {
          label: "School",
          value: "school",
        },
      ],
    },
    {
      name: "pass_code",
      type: "text",
      label: "Pass Code",
      // required: true,
      admin: {
        description: "Unique pass code required to view school photos",
      },
    }
  ],
};
