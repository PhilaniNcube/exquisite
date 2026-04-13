import { CollectionConfig } from "payload";

export const Customers:CollectionConfig = {
    slug: 'customers',
    auth: {
        tokenExpiration: 12 * 60 * 60, // 12 hours
        forgotPassword: {
                        generateEmailSubject: (args) => `Reset your password, ${args?.user?.firstName ?? 'there'}`,
                        generateEmailHTML: (args) => {
                                const token = args?.token;
                                const firstName = args?.user?.firstName ?? 'there';
                const resetLink = `${process.env.NEXT_PUBLIC_SITE_URL}/reset-password?token=${token}`;

                return `
                                <p>Hello ${firstName},</p>
                <p>We received a request to reset your password.</p>
                <p><a href="${resetLink}">Reset your password</a></p>
                <p>If you did not request this, you can ignore this email.</p>
              `;
            }
        },
        verify: {
            generateEmailSubject: (args) => `Please verify your email, ${args.user.firstName}`,
            generateEmailHTML: (args) => {
                return `
                <p>Thank you for creating an account. Please click the link below to verify your email address:</p>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/verify?token=${args.token}">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
              `;
              
            }
        },
      
        
    },
    admin: {
        useAsTitle: 'email',
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
            required: false,
            admin: {width: '50%'}
        } 
    ]
};