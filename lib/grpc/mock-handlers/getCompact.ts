'use client'

// eslint-disable-next-line @typescript-eslint/require-await
export async function getCompact(): Promise<{
  content: string
}> {
  return {
    content: '# Compact Summary\n\nNo compacted issues yet.',
  }
}
