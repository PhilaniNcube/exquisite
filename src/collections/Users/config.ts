import type { CollectionConfig } from 'payload'
import { protectRoles } from './hooks/protectRoles'
import editor from './access/editor'
import user from './access/user'
import admin from './access/admin'
import { checkRole } from './access/checkRole'
import { User } from '@/payload-types'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    create: editor,
    read: user,
    update: user,
    delete: admin,
  },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    // Add more fields as needed
    {
      name: 'firstName',
      type: 'text',
      label: 'First Name',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      label: 'Last Name',
      required: true,
    },
    {
      name: 'roles',
      label: 'Roles',
      type: 'select',
      hasMany: true,
      saveToJWT: true,
      access: {
        update: ({req: {user}}) => checkRole(['admin'], user as User),
      },

      hooks: {
        beforeChange: [protectRoles],
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor',
          value: 'editor',
        },
        {
          label: 'User',
          value: 'user',
        },
      ],
    
    },
    
  ],
}