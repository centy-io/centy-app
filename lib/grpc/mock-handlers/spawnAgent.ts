'use client'

export async function spawnAgent(): Promise<{
  success: boolean
  message: string
}> {
  console.warn('[Demo Mode] spawnAgent called - not available in demo mode')
  return {
    success: false,
    message: 'Not available in demo mode',
  }
}
