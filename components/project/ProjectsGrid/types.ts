import type { ProjectInfo, Organization } from '@/gen/centy_pb'

export interface ProjectGroup {
  name: string
  projects: ProjectInfo[]
}

export interface ProjectsGridData {
  projects: ProjectInfo[]
  organizations: Organization[]
  loading: boolean
  error: string | null
  fetchData: () => Promise<void>
  handleToggleFavorite: (
    e: React.MouseEvent,
    project: ProjectInfo
  ) => Promise<void>
  handleProjectClick: (project: ProjectInfo) => void
  groupedProjects: [string, ProjectGroup][]
}
