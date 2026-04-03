'use client'

import { useState } from 'react'

export function useGitUsernames() {
  const [gitUsernames, setGitUsernames] = useState<string[]>([])

  const onAddGitUsername = () => setGitUsernames([...gitUsernames, ''])
  const onRemoveGitUsername = (i: number) =>
    setGitUsernames(gitUsernames.filter((_, idx) => idx !== i))
  const onGitUsernameChange = (i: number, v: string) => {
    const u = [...gitUsernames]
    u.splice(i, 1, v)
    setGitUsernames(u)
  }

  return {
    gitUsernames,
    onAddGitUsername,
    onRemoveGitUsername,
    onGitUsernameChange,
  }
}
