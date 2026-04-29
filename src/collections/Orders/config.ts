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
          required: false,
          label: "Customer",
        },
        {
          name: "name",
          type: "text",
          required: false,
          label: "Name (Guest)",
        },
        {
          name: "email",
          type: "email",
          required: false,
          label: "Email (Guest)",
        },
        {
          name: "cellNumber",
          type: "text",
          required: true,
          label: "Cell Number",
        },
        {
          name: "studentName",
          type: "text",
          required: false,
          label: "Student Name & Surname",
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
    {
      type: "group",
      name: "paymentDetails",
      label: "Payment Details",
      fields: [
        {
          name: "payRequestId",
          type: "text",
          label: "PayGate Pay Request ID",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "transactionId",
          type: "text",
          label: "PayGate Transaction ID",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "transactionStatus",
          type: "text",
          label: "Transaction Status",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "resultCode",
          type: "text",
          label: "Result Code",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "resultDescription",
          type: "text",
          label: "Result Description",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "payMethod",
          type: "text",
          label: "Payment Method",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "payMethodDetail",
          type: "text",
          label: "Payment Method Detail",
          admin: {
            readOnly: true,
          },
        },
        {
          name: "amount",
          type: "number",
          label: "Amount (cents)",
          admin: {
            readOnly: true,
          },
        },
      ],
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
