import {
  UNGROUPED_ORG_MARKER,
  type ProjectResolution,
} from '@/lib/project-resolver'
import type { PathContextType } from './PathContextProvider.types'

export function buildContextValue(
  isAggregateView: boolean,
  resolution: ProjectResolution | null,
  urlOrg: string | undefined,
  urlProject: string | undefined,
  isLoading: boolean,
  error: string | null,
  navigateToProject: PathContextType['navigateToProject']
): PathContextType {
  if (isAggregateView) {
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
  if (resolution) {
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
