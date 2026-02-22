'use client'

export async function getFeatureStatus(): Promise<{
  features: Record<string, boolean>
}> {
  return { features: {} }
}
