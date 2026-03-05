'use client'

import urlDefaults from '../../constants/url-defaults.json'

const { NEXT_PUBLIC_DAEMON_URL } = process.env

export const DEFAULT_DAEMON_URL =
  NEXT_PUBLIC_DAEMON_URL || urlDefaults.DEFAULT_DAEMON_URL
