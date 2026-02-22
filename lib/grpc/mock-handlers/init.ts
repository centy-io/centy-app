'use client'

export async function init(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] init called - not available in demo mode')
  return { success: true }
}
