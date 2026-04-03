import type { PathContextType } from './PathContextProvider.types'
import { UNGROUPED_ORG_MARKER } from '@/lib/project-resolver'

type NavigateFn = PathContextType['navigateToProject']

export function buildPendingContext(
  urlOrg: string | undefined,
  urlProject: string | undefined,
  isLoading: boolean,
  error: string | null,
  navigateToProject: NavigateFn
): PathContextType {
  return {
    orgSlug: urlOrg === UNGROUPED_ORG_MARKER ? null : (urlOrg ?? null),
    projectName: urlProject ?? null,
    projectPath: '',
    isInitialized: null,
    displayPath: '',
    isAggregateView: false,
    isLoading,
    error,
    navigateToProject,
  }
}
