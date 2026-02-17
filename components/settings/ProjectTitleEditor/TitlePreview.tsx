import type { ProjectInfo } from '@/gen/centy_pb'

interface TitlePreviewProps {
  projectInfo: ProjectInfo
}

export function TitlePreview({ projectInfo }: TitlePreviewProps) {
  const displayName =
    projectInfo.userTitle ||
    projectInfo.projectTitle ||
    projectInfo.name ||
    'Unnamed Project'

  const source = projectInfo.userTitle
    ? 'user title'
    : projectInfo.projectTitle
      ? 'project title'
      : 'directory name'

  return (
    <div className="title-preview">
      <h4 className="title-preview-label">Current Display Name</h4>
      <p className="title-preview-value">
        <strong>{displayName}</strong>
        <span className="title-source">({source})</span>
      </p>
    </div>
  )
}
