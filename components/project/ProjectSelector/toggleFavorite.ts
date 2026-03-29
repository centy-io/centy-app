import { projectSelectorApi } from './projectSelectorApi'
import type { ProjectInfo } from '@/gen/centy_pb'

const { toggleFavoriteRequest } = projectSelectorApi

interface ToggleFavoriteParams {
  e: React.MouseEvent
  project: ProjectInfo
  setProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>
}

export async function toggleFavorite(
  params: ToggleFavoriteParams
): Promise<void> {
  const { e, project, setProjects } = params
  e.stopPropagation()
  try {
    const updated = await toggleFavoriteRequest(project)
    if (updated) {
      setProjects(prev =>
        prev.map(p => (p.path === project.path ? updated : p))
      )
    }
  } catch (err) {
    console.error('Failed to toggle favorite:', err)
  }
}
