import type { CollectionConfig } from "payload";
import admin from "./Users/access/admin";
import { anyone } from "./Users/access/anyone";
import editor from "./Users/access/editor";

const Photos: CollectionConfig = {
    slug: "photos",
    admin: {
        useAsTitle: "title",
        defaultColumns: ["title", "category",],
       
    },
    access: {
        create: admin,
        read: anyone,
        update: editor,
        delete: admin,
    },
    fields: [
        {
            name: "title",
            type: "text",
            label: "Photo Title",
        },
        {
            name: "category",
            type: "relationship",
            label: "Category",
            relationTo: "categories",
            required: true,
            admin: {
                description: "Select the category for this photo.",
            },
            
        },
        {
            name: "image",
            type: "upload",
            label: "Image",
            relationTo: "media",
            required: true,
            admin: {
                description: "Upload the photo here.",
            },
        }
    ]
};

export default Photos;