import { FileType, type FileInfo } from '@/gen/centy_pb'

export function FileList({
  files,
  title,
}: {
  files: FileInfo[]
  title: string
}) {
  if (files.length === 0) return null
  return (
    <div className="file-list">
      <h4>{title}</h4>
      <ul>
        {files.map(file => (
          <li key={file.path}>
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

export function CheckboxList({
  files,
  title,
  selected,
  toggle,
  description,
}: {
  files: FileInfo[]
  title: string
  selected: Set<string>
  toggle: (path: string) => void
  description: string
}) {
  if (files.length === 0) return null
  return (
    <div className="file-list checkbox-list">
      <h4>{title}</h4>
      <p className="description">{description}</p>
      <ul>
        {files.map(file => (
          <li key={file.path}>
            <label>
              <input
                type="checkbox"
                checked={selected.has(file.path)}
                onChange={() => toggle(file.path)}
              />
              <span className="file-icon">
                {file.fileType === FileType.DIRECTORY
                  ? '\uD83D\uDCC1'
                  : '\uD83D\uDCC4'}
              </span>
              <span className="file-path">{file.path}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}
