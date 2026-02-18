'use client'

import { useState, useEffect } from 'react'

export function MobileNotSupportedOverlay() {
  const [isMobile, setIsMobile] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      // Check for mobile device using screen width and touch capability
      const isMobileWidth = window.innerWidth <= 768
      const isTouchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      setIsMobile(isMobileWidth && isTouchDevice)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMobile || dismissed) {
    return null
  }

  return (
    <div className="mobile-not-supported-overlay">
      <div className="mobile-not-supported-content">
        <div className="mobile-not-supported-icon">
          {/* eslint-disable default/no-hardcoded-urls */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
            <line x1="12" y1="18" x2="12.01" y2="18" />
            <line
              x1="2"
              y1="2"
              x2="22"
              y2="22"
              stroke="#ef4444"
              strokeWidth="2.5"
            />
          </svg>
          {/* eslint-enable default/no-hardcoded-urls */}
        </div>
        <h2>Mobile Not Supported</h2>
        <p>
          Centy is designed for local computer use with Git integration for
          version control and collaboration.
        </p>
        <p className="mobile-not-supported-future">
          We have plans to support mobile workflows in the future.
        </p>
        <div className="mobile-not-supported-recommendation">
          <p>
            For the best experience, please use Centy on a desktop or laptop
            computer.
          </p>
        </div>
        <button
          className="mobile-dismiss-button"
          onClick={() => setDismissed(true)}
        >
          Continue Anyway
        </button>
      </div>
    </div>
  )
}
