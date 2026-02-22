import type { PathContextType } from './PathContextProvider.types'
import type { ProjectResolution } from '@/lib/project-resolver'

type NavigateFn = PathContextType['navigateToProject']

export function buildResolvedContext(
  resolution: ProjectResolution,
  isLoading: boolean,
  error: string | null,
  navigateToProject: NavigateFn
): PathContextType {
  return {
    orgSlug: resolution.orgSlug,
    projectName: resolution.projectName,
    projectPath: resolution.projectPath,
    isInitialized: resolution.initialized,
    displayPath: resolution.displayPath,
    isAggregateView: false,
    isLoading,
    error,
    navigateToProject,
  }
}
