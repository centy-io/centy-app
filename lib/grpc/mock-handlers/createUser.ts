'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function createUser(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] createUser called - changes not persisted')
  return { success: true }
}
