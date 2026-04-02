'use client'

export async function createOrganization(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] createOrganization called - changes not persisted')
  return { success: true }
}
