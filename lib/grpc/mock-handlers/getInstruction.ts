'use client'

export async function getInstruction(): Promise<{
  content: string
}> {
  return {
    content: '# Demo Project Instructions\n\nThis is a demo project.',
  }
}
