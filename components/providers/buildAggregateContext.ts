import type { PathContextType } from './PathContextProvider.types'

type NavigateFn = PathContextType['navigateToProject']

export function buildAggregateContext(
  navigateToProject: NavigateFn
): PathContextType {
  return {
    orgSlug: null,
    projectName: null,
    projectPath: '',
    isInitialized: null,
    displayPath: '',
    isAggregateView: true,
    isLoading: false,
    error: null,
    navigateToProject,
  }
}
