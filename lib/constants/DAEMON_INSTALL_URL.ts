const { NEXT_PUBLIC_DAEMON_INSTALL_URL } = process.env

export const DAEMON_INSTALL_URL =
  NEXT_PUBLIC_DAEMON_INSTALL_URL ||
  'https://github.com/centy-io/installer/releases/latest/download/install.sh'
