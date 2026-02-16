'use client'

import { useMemo } from 'react'
import { StateManager } from './StateManager'
import { useConfig } from '@/hooks/useConfig'

/**
 * React hook that provides a StateManager instance with current config.
 */
export function useStateManager(): StateManager {
  const { config } = useConfig()
  return useMemo(() => new StateManager(config), [config])
}
