'use client'

export async function addAsset(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] addAsset called - not available in demo mode')
  return { success: true }
}
