'use client'

const { NEXT_PUBLIC_DAEMON_URL } = process.env
export const DEFAULT_DAEMON_URL =
  NEXT_PUBLIC_DAEMON_URL !== undefined ? NEXT_PUBLIC_DAEMON_URL : ''
