'use client'

import { useEffect } from 'react'
import { enableDemoMode, isDemoMode } from '@/lib/grpc/client'
import { DEMO_ORG_SLUG, DEMO_PROJECT_PATH } from '@/lib/grpc/demo-data'
import type { DaemonStatusContextType } from './DaemonStatusProvider.types'
import {
  createDemoEditors,
  getTestVscodeOverride,
} from './DaemonStatusProvider.helpers'

export function useDemoModeInit(
  setStatus: (s: DaemonStatusContextType['status']) => void,
  setVscodeAvailable: (v: boolean | null) => void,
  setEditors: (e: DaemonStatusContextType['editors']) => void,
  setHasMounted: (v: boolean) => void
) {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search)
      if (urlParams.get('demo') === 'true' && !isDemoMode()) {
        enableDemoMode()
        setStatus('demo')
        setVscodeAvailable(getTestVscodeOverride() ?? true)
        setEditors(createDemoEditors())
        const newUrl = `${window.location.pathname}?org=${DEMO_ORG_SLUG}&project=${encodeURIComponent(DEMO_PROJECT_PATH)}`
        window.history.replaceState({}, '', newUrl)
      } else if (isDemoMode()) {
        setStatus('demo')
        setVscodeAvailable(getTestVscodeOverride() ?? true)
        setEditors(createDemoEditors())
      }
      setHasMounted(true)
    }, 0)
    return () => clearTimeout(timeoutId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
