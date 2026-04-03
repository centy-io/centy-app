'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function setProjectUserTitle(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] setProjectUserTitle called - changes not persisted')
  return { success: true }
}
