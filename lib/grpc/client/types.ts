'use client'

// Type for the mock API
export interface CentyMockAPI {
  activate: () => void
  deactivate: () => void
  isActive: () => boolean
  setData: (data: Record<string, unknown>) => void
  reset: () => void
}

// Extend Window interface
declare global {
  interface Window {
    __CENTY_MOCK__?: CentyMockAPI
  }
}
