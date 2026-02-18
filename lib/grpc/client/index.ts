'use client'

import { enableDemoMode, disableDemoMode, isDemoMode } from './demo-mode'

// Re-export types (ensures global declaration is included)
export type { CentyMockAPI } from './types'

// Re-export demo mode functions
export { enableDemoMode, disableDemoMode, isDemoMode } from './demo-mode'

// Re-export daemon URL functions
export {
  setDaemonUrl,
  getCurrentDaemonUrl,
  isUsingDefaultDaemonUrl,
  resetDaemonUrl,
  DEFAULT_DAEMON_URL,
} from './daemon-url'

// Re-export client
export { centyClient } from './client'

// Expose mock mode API for E2E tests
if (typeof window !== 'undefined') {
  window.__CENTY_MOCK__ = {
    activate: enableDemoMode,
    deactivate: disableDemoMode,
    isActive: isDemoMode,
    setData: (data: Record<string, unknown>) => {
      // For future use: allow tests to inject custom mock data
      console.log('[Demo Mode] Custom data injection:', data)
    },
    reset: () => {
      disableDemoMode()
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    },
  }
}
