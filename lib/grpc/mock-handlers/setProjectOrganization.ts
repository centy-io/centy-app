'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function setProjectOrganization(): Promise<{
  success: boolean
}> {
  console.warn(
    '[Demo Mode] setProjectOrganization called - changes not persisted'
  )
  return { success: true }
}
