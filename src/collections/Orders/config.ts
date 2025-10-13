import { CollectionConfig } from "payload";
import { checkRole } from "../Users/access/checkRole";
import { User } from "@/payload-types";
import admin from "../Users/access/admin";

export const Orders: CollectionConfig = {
  slug: "orders",
  access: {
    read: ({ req }) => {
      if (req.user?.collection === "users") {
        return checkRole(["admin"], req.user as User);
      }

      if (req.user?.collection === "customers") {
        return {
          "customerDetails.customer": {
            equals: req.user.id,
          },
        };
      }

      return false;
    },
    create: () => true,
    update: ({ req }) => {
      if (req.user?.collection === "users") {
        return checkRole(["admin"], req.user as User);
      }

      if (req.user?.collection === "customers") {
        return {
          "customerDetails.customer": {
            equals: req.user.id,
          },
        };
      }

      return false;
    },
    delete: admin,
  },
  fields: [
    {
      type: "group",
      name: "customerDetails",
      label: "Customer Details",
      fields: [
        {
          name: "customer",
          type: "relationship",
          relationTo: "customers",
          required: true,
          label: "Customer",
        },
        {
          name: "cellNumber",
          type: "text",
          required: true,
          label: "Cell Number",
        },
      ],
    },
    {
      name: "productDetails",
      type: "group",
      label: "Product Details",
      fields: [
        {
          name: "orderItems",
          type: "array",
          label: "Order Items",
          required: true,
          minRows: 1,
          fields: [
            {
              name: "product",
              type: "relationship",
              relationTo: "products",
              required: true,
              label: "Product",
            },
            {
              name: "quantity",
              type: "number",
              required: true,
              label: "Quantity",
              min: 1,
              defaultValue: 1,
            },
            {
              name: "priceAtPurchase",
              type: "number",
              required: true,
              label: "Price at Purchase",
              min: 0,
              defaultValue: 0,
            },
            {
              name: "linePrice",
              type: "number",
              required: true,
              label: "Line Price",
              min: 0,
              defaultValue: 0,
            },
            {
                name: "picture",
                type: "relationship",
                relationTo: "schoolPhotos",
                required: true,
                label: "Picture",
            }
          ],
        },
      ],
    },
    {
      name: "orderTotal",
      type: "number",
      label: "Order Total",
      admin: {
        readOnly: true,
      },
      virtual: true,
    },
    {
      name: "orderStatus",
      type: "select",
      label: "Order Status",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
      ],
    },
    {
      name: "paymentReference",
      type: "text",
      label: "Payment Reference",
    },
  ],
  hooks: {
    afterRead: [
      async ({ doc }) => {
        if (doc.productDetails?.orderItems) {
          let total = 0;
          for (const item of doc.productDetails.orderItems) {
            if (
              item.product &&
              typeof item.product === "object" &&
              item.product.price
            ) {
              total += item.product.price * item.quantity;
            }
          }
          doc.orderTotal = total;
        }
        return doc;
      },
    ],
  },
};
