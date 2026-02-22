import type { ProjectInfo } from '@/gen/centy_pb'

interface TitlePreviewProps {
  projectInfo: ProjectInfo
}

export function TitlePreview({ projectInfo }: TitlePreviewProps) {
  return (
    <div className="title-preview">
      <h4 className="title-preview-label">Current Display Name</h4>
      <p className="title-preview-value">
        <strong className="title-preview-strong">
          {projectInfo.userTitle ||
            projectInfo.projectTitle ||
            projectInfo.name ||
            'Unnamed Project'}
        </strong>
        <span className="title-source">
          (
          {projectInfo.userTitle
            ? 'user title'
            : projectInfo.projectTitle
              ? 'project title'
              : 'directory name'}
          )
        </span>
      </p>
    </div>
  )
}
