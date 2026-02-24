declare global {
  interface Window {
    __TEST_VSCODE_AVAILABLE__?: boolean
  }
}

export type DaemonStatus = 'connected' | 'disconnected' | 'checking' | 'demo'
