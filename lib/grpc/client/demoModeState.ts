'use client'

const DEMO_MODE_STORAGE_KEY = 'centy_demo_mode'

// Demo mode state
let demoModeEnabled = false

// Initialize demo mode from sessionStorage on load
if (typeof window !== 'undefined') {
  demoModeEnabled = sessionStorage.getItem(DEMO_MODE_STORAGE_KEY) === 'true'
}

export const demoModeState = {
  get enabled() {
    return demoModeEnabled
  },
  enable() {
    demoModeEnabled = true
    if (typeof window === 'undefined') return
    sessionStorage.setItem(DEMO_MODE_STORAGE_KEY, 'true')
  },
  disable() {
    demoModeEnabled = false
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(DEMO_MODE_STORAGE_KEY)
    }
  },
}
