'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function syncUsers(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] syncUsers called - not available in demo mode')
  return { success: true }
}
