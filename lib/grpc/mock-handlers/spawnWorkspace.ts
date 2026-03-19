'use client'

export async function spawnWorkspace(): Promise<{
  success: boolean
  message: string
}> {
  console.warn('[Demo Mode] spawnWorkspace called - not available in demo mode')
  return {
    success: false,
    message: 'Not available in demo mode',
  }
}
