'use server'

import { logout } from '@payloadcms/next/auth'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function logoutAction() {
  try {
    await logout({ allSessions: true, config })
    revalidatePath('/', 'layout')
  } catch (error) {
    throw new Error(
      `Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
  redirect('/')
}