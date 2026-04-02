'use client'

import type { DaemonStatus } from './DaemonStatusProvider.types'
import { createDemoEditors } from './createDemoEditors'
import type { EditorInfo } from '@/gen/centy_pb'

type SetState<T> = (value: T) => void

// Apply demo mode state to all status setters
export function applyDemoState(
  setStatus: SetState<DaemonStatus>,
  setEds: SetState<EditorInfo[]>,
  setEditorsLoaded: SetState<boolean>
) {
  setStatus('demo')
  setEds(createDemoEditors())
  setEditorsLoaded(true)
}
