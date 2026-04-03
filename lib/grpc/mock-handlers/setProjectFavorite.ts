'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function setProjectFavorite(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] setProjectFavorite called - changes not persisted')
  return { success: true }
}
