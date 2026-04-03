'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getManifest(): Promise<{
  success: boolean
  error: string
  manifest: {
    schemaVersion: number
    centyVersion: string
    createdAt: string
    updatedAt: string
    $typeName: 'centy.v1.Manifest'
  }
}> {
  return {
    success: true,
    error: '',
    manifest: {
      schemaVersion: 1,
      centyVersion: '0.1.5',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
      $typeName: 'centy.v1.Manifest',
    },
  }
}
