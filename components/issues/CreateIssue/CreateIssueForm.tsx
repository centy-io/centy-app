'use client'

import type { ReactElement } from 'react'
import type { CreateIssueFormProps } from './CreateIssue.types'
import { PrioritySelect } from './PrioritySelect'
import { StatusSelect } from './StatusSelect'
import { CreateIssueFormActions } from './CreateIssueFormActions'
import { CreateIssueTitleField } from './CreateIssueTitleField'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { TextEditor } from '@/components/shared/TextEditor'

export function CreateIssueForm(props: CreateIssueFormProps): ReactElement {
  const {
    projectPath,
    title,
    setTitle,
    description,
    setDescription,
    priority,
    setPriority,
    status,
    setStatus,
    loading,
    error,
    stateOptions,
    setPendingAssets,
    assetUploaderRef,
    onSubmit,
    onCancel,
  } = props
  return (
    <form
      className="create-issue-form"
      onSubmit={e => {
        void onSubmit(e)
      }}
    >
      <CreateIssueTitleField title={title} setTitle={setTitle} />
      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description:
        </label>
        <TextEditor
          value={description}
          onChange={setDescription}
          format="md"
          mode="edit"
          placeholder="Describe the issue..."
          minHeight={150}
        />
      </div>
      <PrioritySelect priority={priority} setPriority={setPriority} />
      <StatusSelect
        status={status}
        setStatus={setStatus}
        stateOptions={stateOptions}
      />
      <div className="form-group">
        <label className="form-label">Attachments:</label>
        <AssetUploader
          ref={assetUploaderRef}
          projectPath={projectPath}
          mode="create"
          onPendingChange={setPendingAssets}
        />
      </div>
      <CreateIssueFormActions
        error={error}
        loading={loading}
        title={title}
        onCancel={onCancel}
      />
    </form>
  )
}
