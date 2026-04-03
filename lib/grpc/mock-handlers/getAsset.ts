'use client'

// eslint-disable-next-line @typescript-eslint/require-await
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
