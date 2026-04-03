import type { CheckboxListProps } from './CheckboxListProps'
import { FileType } from '@/gen/centy_pb'

export function CheckboxList({
  files,
  title,
  selected,
  toggle,
  description,
}: CheckboxListProps) {
  if (files.length === 0) return null
  return (
    <div className="file-list checkbox-list">
      <h4 className="file-list-title">{title}</h4>
      <p className="description">{description}</p>
      <ul className="file-list-items">
        {files.map(file => (
          <li className="file-list-item" key={file.path}>
            <label className="form-label">
              <input
                className="form-checkbox"
                type="checkbox"
                checked={selected.has(file.path)}
                onChange={() => {
                  toggle(file.path)
                }}
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
