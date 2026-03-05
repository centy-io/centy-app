const { NEXT_PUBLIC_DAEMON_VERSION_URL } = process.env

export const DAEMON_VERSION_URL =
  NEXT_PUBLIC_DAEMON_VERSION_URL ||
  'https://api.github.com/repos/centy-io/centy-daemon/releases/latest'
