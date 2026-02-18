'use client'

// Organization and user write operations for demo mode

export async function createOrganization(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] createOrganization called - changes not persisted')
  return { success: true }
}

export async function updateOrganization(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateOrganization called - changes not persisted')
  return { success: true }
}

export async function deleteOrganization(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteOrganization called - changes not persisted')
  return { success: true }
}

export async function syncUsers(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] syncUsers called - not available in demo mode')
  return { success: true }
}

export async function createLink(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] createLink called - changes not persisted')
  return { success: true }
}

export async function deleteLink(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteLink called - changes not persisted')
  return { success: true }
}

export async function addAsset(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] addAsset called - not available in demo mode')
  return { success: true }
}

export async function deleteAsset(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteAsset called - not available in demo mode')
  return { success: true }
}

export async function getAsset(): Promise<{
  success: boolean
  data: Uint8Array
}> {
  console.warn('[Demo Mode] getAsset called - returning empty data')
  return {
    success: true,
    data: new Uint8Array(),
  }
}
