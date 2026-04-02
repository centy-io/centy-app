/**
 * Resolution result for a project lookup
 */
export interface ProjectResolution {
  /** Absolute filesystem path for API calls */
  projectPath: string
  /** Project name (directory name) */
  projectName: string
  /** Organization slug (null if ungrouped) */
  orgSlug: string | null
  /** Whether project has .centy folder */
  initialized: boolean
  /** Display path (with ~/ for home) */
  displayPath: string
}
