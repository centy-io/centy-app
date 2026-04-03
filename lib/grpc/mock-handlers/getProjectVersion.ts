'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getProjectVersion(): Promise<{
  projectVersion: string
  daemonVersion: string
}> {
  return {
    projectVersion: '0.1.5',
    daemonVersion: '0.1.5',
  }
}
