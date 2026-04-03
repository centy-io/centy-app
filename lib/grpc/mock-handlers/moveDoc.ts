'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function moveDoc(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] moveDoc called - not available in demo mode')
  return { success: true }
}
