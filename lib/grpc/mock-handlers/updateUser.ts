'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function updateUser(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateUser called - changes not persisted')
  return { success: true }
}
