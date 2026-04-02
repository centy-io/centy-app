import type { FileListProps } from './FileListProps'
import { FileType } from '@/gen/centy_pb'

export function FileList({ files, title }: FileListProps) {
  if (files.length === 0) return null
  return (
    <div className="file-list">
      <h4 className="file-list-title">{title}</h4>
      <ul className="file-list-items">
        {files.map(file => (
          <li className="file-list-item" key={file.path}>
            <span className="file-icon">
              {file.fileType === FileType.DIRECTORY
                ? '\uD83D\uDCC1'
                : '\uD83D\uDCC4'}
            </span>
            <span className="file-path">{file.path}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
