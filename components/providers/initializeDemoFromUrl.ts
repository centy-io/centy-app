'use client'

import type { DaemonStatus } from './DaemonStatusProvider.types'
import { applyDemoState } from './applyDemoState'
import { buildDemoUrl } from './buildDemoUrl'
import { enableDemoMode, isDemoMode } from '@/lib/grpc/client'
import { DEMO_ORG_SLUG, DEMO_PROJECT_PATH } from '@/lib/grpc/demo-data'
import type { EditorInfo } from '@/gen/centy_pb'

type SetState<T> = (value: T) => void

export function initializeDemoFromUrl(
  setStatus: SetState<DaemonStatus>,
  setVscodeAvailable: SetState<boolean | null>,
  setEditors: SetState<EditorInfo[]>
) {
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('demo') === 'true' && !isDemoMode()) {
    enableDemoMode()
    applyDemoState(setStatus, setVscodeAvailable, setEditors)
    const newUrl = buildDemoUrl(DEMO_ORG_SLUG, DEMO_PROJECT_PATH)
    window.history.replaceState({}, '', newUrl)
  } else if (isDemoMode()) {
    applyDemoState(setStatus, setVscodeAvailable, setEditors)
  }
}
