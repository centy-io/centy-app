'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function setProjectTitle(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] setProjectTitle called - changes not persisted')
  return { success: true }
}
