'use client'

export async function syncUsers(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] syncUsers called - not available in demo mode')
  return { success: true }
}
