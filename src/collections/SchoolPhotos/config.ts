import { CollectionConfig } from "payload";
import editor from "../Users/access/editor";

export const SchoolPhotos: CollectionConfig = {
  slug: "schoolPhotos",
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
      label: "Name",
    },
    {
      name: "photoType",
      type: "radio",
      interfaceName: "PhotoTypeRadio",
      label: "Photo Type",
      options: ["Individual", "Class", "Sports", "Group"],
    },
    {
      type: "group",
      name: "schoolDetails",
      label: "School Details",
      fields: [
        {
          name: "school",
          type: "relationship",
          relationTo: "schools",
          required: true,
          label: "School",
        },
        {
          name: "class",
          type: "relationship",
          relationTo: "classes",
          required: false,
          label: "Class",
          filterOptions: ({ data }) => {
            if (data?.schoolDetails?.school) {
              return {
                school: {
                  equals: data.schoolDetails.school,
                },
              };
            }
            return true;
          },
        },
      ],
    },
    {
      name: "studentName",
      type: "text",
      required: false,
      label: "Student Name (for Individual Photos)",
    },
    {
      name: "photo",
      type: "relationship",
      relationTo: "media",
      required: true,
      label: "Photo",
    },
  ],
};
