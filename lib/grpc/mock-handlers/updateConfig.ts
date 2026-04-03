'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function updateConfig(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateConfig called - changes not persisted')
  return { success: true }
}
