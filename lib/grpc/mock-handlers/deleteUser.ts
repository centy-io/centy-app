'use client'

export async function deleteUser(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteUser called - changes not persisted')
  return { success: true }
}
