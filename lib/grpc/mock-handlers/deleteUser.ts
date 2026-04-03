'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function deleteUser(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteUser called - changes not persisted')
  return { success: true }
}
