'use client'

export async function deleteOrganization(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteOrganization called - changes not persisted')
  return { success: true }
}
