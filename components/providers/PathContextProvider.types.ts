/**
 * Context type for path-based navigation
 */
export interface PathContextType {
  /** Organization slug from URL (null if ungrouped or aggregate view) */
  orgSlug: string | null
  /** Project name from URL (null if aggregate view) */
  projectName: string | null
  /** Absolute filesystem path for API calls (empty if not resolved or aggregate view) */
  projectPath: string
  /** Whether the project is initialized (.centy folder exists) */
  isInitialized: boolean | null
  /** Display path (with ~/ for home) */
  displayPath: string
  /** Whether we're in an aggregate view (no project selected) */
  isAggregateView: boolean
  /** Whether the project is currently being resolved */
  isLoading: boolean
  /** Error if project resolution failed */
  error: string | null
  /** Navigate to a different project */
  navigateToProject: (
    orgSlug: string | null,
    projectName: string,
    page?: string
  ) => void
}

export const LAST_PROJECT_STORAGE_KEY = 'centy-last-project-path'

// Known root-level routes that are NOT org/project paths
export const ROOT_ROUTES = new Set([
  'organizations',
  'settings',
  'archived',
  'assets',
  'project',
])
