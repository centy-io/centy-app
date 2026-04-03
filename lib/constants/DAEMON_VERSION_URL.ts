import urlDefaults from './url-defaults.json'

const { NEXT_PUBLIC_DAEMON_VERSION_URL } = process.env

export const DAEMON_VERSION_URL =
  NEXT_PUBLIC_DAEMON_VERSION_URL ?? urlDefaults.DAEMON_VERSION_URL
