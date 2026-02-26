'use client'

import { useContext } from 'react'
import { PathContext } from './PathContext'

/**
 * Hook to access path context
 */
export function usePathContext() {
  return useContext(PathContext)
}
