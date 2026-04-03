'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function deleteOrganization(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteOrganization called - changes not persisted')
  return { success: true }
}
