import { CollectionConfig } from "payload";

export const Customers:CollectionConfig = {
    slug: 'customers',
    auth: {
        tokenExpiration: 12 * 60 * 60, // 12 hours
        verify: true,
        cookies: {
            secure: true,
            sameSite: 'None',
            domain: process.env.COOKIE_DOMAIN || 'localhost',
        }
    },
    admin: {
        useAsTitle: 'firstName',

    },
    access: {
        create: () => true,
        admin: () => false,
    },
    fields: [
        {
            type: 'row',
            fields: [
                {
                    type: 'text',
                    name: 'firstName',
                    label: 'First Name',
                },
                {
                    type: 'text',
                    name: 'lastName',
                    label: 'Last Name',
                }
            ]
        },
        {
            name: 'userType',
            type: 'radio',
            interfaceName: 'UserTypeRadio',
            label: 'User Type',
            options: [
                "Parent/Guardian",
                "Student",
                "Teacher/Staff",
                "Client"
            ],
            defaultValue: "Client",
            required: true,
            admin: {width: '50%'}
        } 
    ]
};