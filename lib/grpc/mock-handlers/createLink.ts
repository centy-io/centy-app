'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function createLink(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] createLink called - changes not persisted')
  return { success: true }
}
