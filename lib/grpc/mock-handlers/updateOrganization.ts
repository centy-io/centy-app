'use client'

export async function updateOrganization(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateOrganization called - changes not persisted')
  return { success: true }
}
