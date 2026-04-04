'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function updateLink(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateLink called - changes not persisted')
  return { success: true }
}
