'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function shutdown(): Promise<{
  success: boolean
  message: string
}> {
  console.warn('[Demo Mode] shutdown called - not available in demo mode')
  return {
    success: false,
    message: 'Not available in demo mode',
  }
}
