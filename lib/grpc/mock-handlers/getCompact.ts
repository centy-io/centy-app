'use client'

export async function getCompact(): Promise<{
  content: string
}> {
  return {
    content: '# Compact Summary\n\nNo compacted issues yet.',
  }
}
