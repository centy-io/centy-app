import type { TitleScope } from './TitleScope'
import type { ProjectInfo } from '@/gen/centy_pb'

interface TitleDerivedValues {
  currentTitle: string
  setCurrentTitle: (v: string) => void
  hasChanges: boolean
}

export function buildTitleDerivedValues(
  scope: TitleScope,
  userTitle: string,
  projectTitle: string,
  setUserTitle: (v: string) => void,
  setProjectTitle: (v: string) => void,
  projectInfo: ProjectInfo | null
): TitleDerivedValues {
  const currentTitle = scope === 'user' ? userTitle : projectTitle
  const setCurrentTitle = scope === 'user' ? setUserTitle : setProjectTitle
  const infoUserTitle = projectInfo ? projectInfo.userTitle : ''
  const infoProjectTitle = projectInfo ? projectInfo.projectTitle : ''
  const hasChanges =
    scope === 'user'
      ? userTitle !== (infoUserTitle || '')
      : projectTitle !== (infoProjectTitle || '')
  return { currentTitle, setCurrentTitle, hasChanges }
}
