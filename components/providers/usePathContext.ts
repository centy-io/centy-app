'use client'

import { useContext } from 'react'
import { PathContext } from './PathContext'
import { PathContextProviderError } from '@/lib/errors'

/**
 * Hook to access path context
 */
export function usePathContext() {
  const context = useContext(PathContext)
  if (!context) {
    throw new PathContextProviderError()
  }
  return context
}
