import urlDefaults from './url-defaults.json'

const { NEXT_PUBLIC_WORKTREE_OPEN_URL } = process.env

export const WORKTREE_OPEN_URL =
  NEXT_PUBLIC_WORKTREE_OPEN_URL ?? urlDefaults.WORKTREE_OPEN_URL
