import urlDefaults from './url-defaults.json'

const { NEXT_PUBLIC_DAEMON_INSTALL_URL } = process.env

export const DAEMON_INSTALL_URL =
  NEXT_PUBLIC_DAEMON_INSTALL_URL || urlDefaults.DAEMON_INSTALL_URL
