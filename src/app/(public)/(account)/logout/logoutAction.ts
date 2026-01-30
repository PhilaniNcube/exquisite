'use server'

import { logout } from '@payloadcms/next/auth'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function logoutAction() {
  console.log('[LogoutAction] Starting logout process...')
  console.log('[LogoutAction] Config:', { 
    hasConfig: !!config,
    configKeys: config ? Object.keys(config) : []
  })
  
  try {
    console.log('[LogoutAction] Calling logout with allSessions: true')
    const result = await logout({ allSessions: true, config })
    console.log('[LogoutAction] Logout completed successfully:', result)
    
    console.log('[LogoutAction] Revalidating path: /')
    revalidatePath('/', 'layout')
    console.log('[LogoutAction] Path revalidated')
  } catch (error) {
    console.error('[LogoutAction] Error during logout:', error)
    console.error('[LogoutAction] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    })
    throw new Error(
      `Logout failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
  }
  
  console.log('[LogoutAction] Redirecting to /')
  redirect('/')
}