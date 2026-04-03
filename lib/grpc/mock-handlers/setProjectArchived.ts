'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function setProjectArchived(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] setProjectArchived called - changes not persisted')
  return { success: true }
}
