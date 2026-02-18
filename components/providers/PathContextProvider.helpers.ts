import type { PathContextType } from './PathContextProvider.types'
import {
  UNGROUPED_ORG_MARKER,
  type ProjectResolution,
} from '@/lib/project-resolver'

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

export function buildPendingContext(
  urlOrg: string | undefined,
  urlProject: string | undefined,
  isLoading: boolean,
  error: string | null,
  navigateToProject: NavigateFn
): PathContextType {
  return {
    orgSlug:
      urlOrg === UNGROUPED_ORG_MARKER
        ? null
        : urlOrg !== undefined
          ? urlOrg
          : null,
    projectName: urlProject !== undefined ? urlProject : null,
    projectPath: '',
    isInitialized: null,
    displayPath: '',
    isAggregateView: false,
    isLoading,
    error,
    navigateToProject,
  }
}
