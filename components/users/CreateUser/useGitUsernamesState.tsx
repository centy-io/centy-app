'use client'

import { useState } from 'react'

export function useGitUsernamesState() {
  const [gitUsernames, setGitUsernames] = useState<string[]>([])
  const onAddGitUsername = () => setGitUsernames(prev => [...prev, ''])
  const onRemoveGitUsername = (i: number) =>
    setGitUsernames(prev => prev.filter((_, idx) => idx !== i))
  const onGitUsernameChange = (i: number, v: string) =>
    setGitUsernames(prev => {
      const u = [...prev]
      u.splice(i, 1, v)
      return u
    })
  return {
    gitUsernames,
    onAddGitUsername,
    onRemoveGitUsername,
    onGitUsernameChange,
  }
}
