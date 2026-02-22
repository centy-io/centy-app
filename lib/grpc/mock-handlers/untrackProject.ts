'use client'

export async function untrackProject(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] untrackProject called - not available in demo mode')
  return { success: true }
}
