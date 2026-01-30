'use server'

import { logout } from '@payloadcms/next/auth'
import config from '@payload-config'

export async function logoutAction() {
  console.log("Logging out user...")
  try {
    await logout({ allSessions: true, config })
  } catch (error) {
    throw new Error(
      `Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
}