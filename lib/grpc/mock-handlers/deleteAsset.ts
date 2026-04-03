'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function deleteAsset(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteAsset called - not available in demo mode')
  return { success: true }
}
