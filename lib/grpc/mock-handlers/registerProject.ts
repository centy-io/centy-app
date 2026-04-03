'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function registerProject(): Promise<{
  success: boolean
}> {
  console.warn(
    '[Demo Mode] registerProject called - not available in demo mode'
  )
  return { success: true }
}
