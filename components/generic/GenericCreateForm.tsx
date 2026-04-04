import Link from 'next/link'
import type { RouteLiteral } from 'nextjs-routes'
import { GenericCreateFormFields } from './GenericCreateFormFields'
import type { ItemTypeConfigProto } from '@/gen/centy_pb'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface GenericCreateFormProps {
  displayName: string
  title: string
  setTitle: (v: string) => void
  config: ItemTypeConfigProto | null
  status: string
  setStatus: (v: string) => void
  customFields: Record<string, string>
  setCustomFields: (v: Record<string, string>) => void
  currentProjectPath: string
  additionalProjects: string[]
  setAdditionalProjects: (v: string[]) => void
  loading: boolean
  error: string | null
  listUrl: RouteLiteral
  handleSubmit: (e: React.FormEvent) => void
}

export function GenericCreateForm({
  displayName,
  title,
  setTitle,
  config,
  status,
  setStatus,
  customFields,
  setCustomFields,
  currentProjectPath,
  additionalProjects,
  setAdditionalProjects,
  loading,
  error,
  listUrl,
  handleSubmit,
}: GenericCreateFormProps): React.JSX.Element {
  return (
    <div className="create-generic-item">
      <h2 className="create-generic-title">Create New {displayName}</h2>
      <form className="create-generic-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="title">
            Title:
          </label>
          <input
            className="form-input"
            id="title"
            type="text"
            value={title}
            onChange={e => {
              setTitle(e.target.value)
            }}
            placeholder={`${displayName} title`}
            required
          />
        </div>
        <GenericCreateFormFields
          config={config}
          status={status}
          setStatus={setStatus}
          customFields={customFields}
          setCustomFields={setCustomFields}
          currentProjectPath={currentProjectPath}
          additionalProjects={additionalProjects}
          setAdditionalProjects={setAdditionalProjects}
        />
        {error && <DaemonErrorMessage error={error} />}
        <div className="actions">
          <Link href={listUrl} className="secondary">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!title.trim() || loading}
            className="primary"
          >
            {loading ? 'Creating...' : `Create ${displayName}`}
          </button>
        </div>
      </form>
    </div>
  )
}
