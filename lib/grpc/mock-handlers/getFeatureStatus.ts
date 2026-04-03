'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getFeatureStatus(): Promise<{
  features: Record<string, boolean>
}> {
  return { features: {} }
}
