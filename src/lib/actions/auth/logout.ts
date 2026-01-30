'use server'

import { logout } from '@payloadcms/next/auth'
import config from '@payload-config'
import { cookies } from 'next/headers'
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
    
    // Manually delete the payload-token cookie that was set during login
    console.log('[LogoutAction] Deleting payload-token cookie')
    const cookieStore = await cookies()
    cookieStore.delete('payload-token')
    
    console.log('[LogoutAction] Revalidating path: /')
    revalidatePath('/', 'layout')
    console.log('[LogoutAction] Path revalidated')
    
    console.log('[LogoutAction] Returning success response')
    return { success: true }
  } catch (error) {
    console.error('[LogoutAction] Error during logout:', error)
    console.error('[LogoutAction] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      type: typeof error
    })
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}
