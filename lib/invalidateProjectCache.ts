'use client'

import { projectResolverState } from './projectResolverState'

/**
 * Invalidate the project cache (call when projects change)
 */
export function invalidateProjectCache(): void {
  projectResolverState.clearCache()
}
