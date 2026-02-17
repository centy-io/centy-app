import type { ProjectInfo } from '@/gen/centy_pb'

export interface ProjectTitleEditorProps {
  projectPath: string
}

export type TitleScope = 'user' | 'project'

export interface UseProjectTitleResult {
  projectInfo: ProjectInfo | null
  userTitle: string
  projectTitle: string
  scope: TitleScope
  saving: boolean
  error: string | null
  success: string | null
  currentTitle: string
  hasChanges: boolean
  setUserTitle: (title: string) => void
  setProjectTitle: (title: string) => void
  setScope: (scope: TitleScope) => void
  setCurrentTitle: (title: string) => void
  handleSave: () => Promise<void>
  handleClear: () => Promise<void>
}
