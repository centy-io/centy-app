'use client'

import type { DaemonStatus } from './DaemonStatusProvider.types'
import { createDemoEditors } from './createDemoEditors'
import { resolveVscodeAvailable } from './resolveVscodeAvailable'
import type { EditorInfo } from '@/gen/centy_pb'

type SetState<T> = (value: T) => void

// Apply demo mode state to all status setters
export function applyDemoState(
  setStatus: SetState<DaemonStatus>,
  setVscode: SetState<boolean | null>,
  setEds: SetState<EditorInfo[]>
) {
  setStatus('demo')
  setVscode(resolveVscodeAvailable(true))
  setEds(createDemoEditors())
}
