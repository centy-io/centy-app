'use client'

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactElement,
} from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetIssueRequestSchema,
  UpdateIssueRequestSchema,
  DeleteIssueRequestSchema,
  ListAssetsRequestSchema,
  OpenInTempWorkspaceRequestSchema,
  LlmAction,
  type Issue,
  type Asset,
} from '@/gen/centy_pb'
import {
  usePathContext,
  useProjectPathToUrl,
} from '@/components/providers/PathContextProvider'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useLastSeenIssues } from '@/hooks/useLastSeenIssues'
import { useStateManager } from '@/lib/state'
import { AssetUploader } from '@/components/assets/AssetUploader'
import { TextEditor } from '@/components/shared/TextEditor'
import { LinkSection } from '@/components/shared/LinkSection'
import { MoveModal } from '@/components/shared/MoveModal'
import { DuplicateModal } from '@/components/shared/DuplicateModal'
import { StatusConfigDialog } from '@/components/shared/StatusConfigDialog'
import { EditorSelector } from '@/components/shared/EditorSelector'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { useAppLink } from '@/hooks/useAppLink'
import { AssigneeSelector } from '@/components/users/AssigneeSelector'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface IssueDetailProps {
  issueNumber: string
}

const getPriorityClass = (priorityLabel: string): string => {
  switch (priorityLabel.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'priority-high'
    case 'medium':
    case 'normal':
      return 'priority-medium'
    case 'low':
      return 'priority-low'
  }
  if (priorityLabel.startsWith('P') || priorityLabel.startsWith('p')) {
    const num = parseInt(priorityLabel.slice(1))
    if (num === 1) return 'priority-high'
    if (num === 2) return 'priority-medium'
    return 'priority-low'
  }
  return ''
}

function DeleteConfirmSection({
  showDeleteConfirm,
  deleting,
  onCancel,
  onDelete,
}: {
  showDeleteConfirm: boolean
  deleting: boolean
  onCancel: () => void
  onDelete: () => void
}) {
  if (!showDeleteConfirm) return null
  return (
    <div className="delete-confirm">
      <p>Are you sure you want to delete this issue?</p>
      <div className="delete-confirm-actions">
        <button onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="confirm-delete-btn"
        >
          {deleting ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  )
}

function IssueHeaderActions({
  isEditing,
  openingInVscode,
  saving,
  onOpenInVscode,
  onOpenInTerminal,
  onEdit,
  onMove,
  onDuplicate,
  onDelete,
  onCancelEdit,
  onSave,
}: {
  isEditing: boolean
  openingInVscode: boolean
  saving: boolean
  onOpenInVscode: () => void
  onOpenInTerminal: () => void
  onEdit: () => void
  onMove: () => void
  onDuplicate: () => void
  onDelete: () => void
  onCancelEdit: () => void
  onSave: () => void
}) {
  if (isEditing) {
    return (
      <>
        <button onClick={onCancelEdit} className="cancel-btn">
          Cancel
        </button>
        <button onClick={onSave} disabled={saving} className="save-btn">
          {saving ? 'Saving...' : 'Save'}
        </button>
      </>
    )
  }
  return (
    <>
      <EditorSelector
        onOpenInVscode={onOpenInVscode}
        onOpenInTerminal={onOpenInTerminal}
        loading={openingInVscode}
      />
      <button onClick={onEdit} className="edit-btn">
        Edit
      </button>
      <button onClick={onMove} className="move-btn">
        Move
      </button>
      <button onClick={onDuplicate} className="duplicate-btn">
        Duplicate
      </button>
      <button onClick={onDelete} className="delete-btn">
        Delete
      </button>
    </>
  )
}

interface IssueEditFormProps {
  editTitle: string
  editDescription: string
  editStatus: string
  editPriority: number
  stateOptions: { value: string; label: string }[]
  projectPath: string
  issueNumber: string
  assets: Asset[]
  onTitleChange: (v: string) => void
  onDescriptionChange: (v: string) => void
  onStatusChange: (v: string) => void
  onPriorityChange: (v: number) => void
  onAssetsChange: (a: Asset[]) => void
}

function EditFormStatusPriority({
  editStatus,
  editPriority,
  stateOptions,
  onStatusChange,
  onPriorityChange,
}: Pick<
  IssueEditFormProps,
  | 'editStatus'
  | 'editPriority'
  | 'stateOptions'
  | 'onStatusChange'
  | 'onPriorityChange'
>) {
  return (
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="edit-status">Status:</label>
        <select
          id="edit-status"
          value={editStatus}
          onChange={e => onStatusChange(e.target.value)}
        >
          {stateOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="edit-priority">Priority:</label>
        <select
          id="edit-priority"
          value={editPriority}
          onChange={e => onPriorityChange(Number(e.target.value))}
        >
          <option value={1}>High</option>
          <option value={2}>Medium</option>
          <option value={3}>Low</option>
        </select>
      </div>
    </div>
  )
}

function IssueEditForm(props: IssueEditFormProps) {
  return (
    <div className="edit-form">
      <div className="form-group">
        <label htmlFor="edit-title">Title:</label>
        <input
          id="edit-title"
          type="text"
          value={props.editTitle}
          onChange={e => props.onTitleChange(e.target.value)}
        />
      </div>

      <EditFormStatusPriority
        editStatus={props.editStatus}
        editPriority={props.editPriority}
        stateOptions={props.stateOptions}
        onStatusChange={props.onStatusChange}
        onPriorityChange={props.onPriorityChange}
      />

      <div className="form-group">
        <label htmlFor="edit-description">Description:</label>
        <TextEditor
          value={props.editDescription}
          onChange={props.onDescriptionChange}
          format="md"
          mode="edit"
          placeholder="Describe the issue..."
          minHeight={200}
        />
      </div>

      <div className="form-group">
        <label>Attachments:</label>
        <AssetUploader
          projectPath={props.projectPath}
          issueId={props.issueNumber}
          mode="edit"
          initialAssets={props.assets}
          onAssetsChange={props.onAssetsChange}
        />
      </div>
    </div>
  )
}

function StatusSelector({
  issue,
  stateManager,
  stateOptions,
  showStatusDropdown,
  updatingStatus,
  statusDropdownRef,
  onToggleDropdown,
  onStatusChange,
}: {
  issue: Issue
  stateManager: ReturnType<typeof useStateManager>
  stateOptions: { value: string; label: string }[]
  showStatusDropdown: boolean
  updatingStatus: boolean
  statusDropdownRef: React.RefObject<HTMLDivElement | null>
  onToggleDropdown: () => void
  onStatusChange: (status: string) => void
}) {
  return (
    <div className="status-selector" ref={statusDropdownRef}>
      <button
        className={`status-badge status-badge-clickable ${stateManager.getStateClass((issue.metadata && issue.metadata.status) || '')} ${updatingStatus ? 'updating' : ''}`}
        onClick={onToggleDropdown}
        disabled={updatingStatus}
        aria-label="Change status"
        aria-expanded={showStatusDropdown}
        aria-haspopup="listbox"
      >
        {updatingStatus
          ? 'Updating...'
          : (issue.metadata && issue.metadata.status) || 'unknown'}
        <span className="status-dropdown-arrow" aria-hidden="true">
          ▼
        </span>
      </button>
      {showStatusDropdown && (
        <ul
          className="status-dropdown"
          role="listbox"
          aria-label="Status options"
        >
          {stateOptions.map(option => (
            <li
              key={option.value}
              role="option"
              aria-selected={
                option.value === (issue.metadata && issue.metadata.status)
              }
              className={`status-option ${stateManager.getStateClass(option.value)} ${option.value === (issue.metadata && issue.metadata.status) ? 'selected' : ''}`}
              onClick={() => onStatusChange(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

interface IssueViewContentProps {
  issue: Issue
  issueNumber: string
  projectPath: string
  stateManager: ReturnType<typeof useStateManager>
  stateOptions: { value: string; label: string }[]
  showStatusDropdown: boolean
  updatingStatus: boolean
  statusDropdownRef: React.RefObject<HTMLDivElement | null>
  assets: Asset[]
  assignees: string[]
  onToggleStatusDropdown: () => void
  onStatusChange: (status: string) => void
  onAssetsChange: (a: Asset[]) => void
  onAssigneesChange: (a: string[]) => void
}

function IssueMetadataBar({
  issue,
  ...rest
}: Pick<
  IssueViewContentProps,
  | 'issue'
  | 'stateManager'
  | 'stateOptions'
  | 'showStatusDropdown'
  | 'updatingStatus'
  | 'statusDropdownRef'
  | 'onToggleStatusDropdown'
  | 'onStatusChange'
>) {
  return (
    <div className="issue-metadata">
      <StatusSelector
        issue={issue}
        stateManager={rest.stateManager}
        stateOptions={rest.stateOptions}
        showStatusDropdown={rest.showStatusDropdown}
        updatingStatus={rest.updatingStatus}
        statusDropdownRef={rest.statusDropdownRef}
        onToggleDropdown={rest.onToggleStatusDropdown}
        onStatusChange={rest.onStatusChange}
      />
      <span
        className={`priority-badge ${getPriorityClass((issue.metadata && issue.metadata.priorityLabel) || '')}`}
      >
        {(issue.metadata && issue.metadata.priorityLabel) || 'unknown'}
      </span>
      <span className="issue-date">
        Created:{' '}
        {issue.metadata && issue.metadata.createdAt
          ? new Date(issue.metadata.createdAt).toLocaleString()
          : '-'}
      </span>
      {issue.metadata && issue.metadata.updatedAt && (
        <span className="issue-date">
          Updated: {new Date(issue.metadata.updatedAt).toLocaleString()}
        </span>
      )}
    </div>
  )
}

function IssueViewContent(props: IssueViewContentProps) {
  return (
    <>
      <h1 className="issue-title">{props.issue.title}</h1>

      <IssueMetadataBar
        issue={props.issue}
        stateManager={props.stateManager}
        stateOptions={props.stateOptions}
        showStatusDropdown={props.showStatusDropdown}
        updatingStatus={props.updatingStatus}
        statusDropdownRef={props.statusDropdownRef}
        onToggleStatusDropdown={props.onToggleStatusDropdown}
        onStatusChange={props.onStatusChange}
      />

      <div className="issue-assignees">
        <h4>Assignees</h4>
        <AssigneeSelector
          projectPath={props.projectPath}
          issueId={props.issueNumber}
          currentAssignees={props.assignees}
          onAssigneesChange={props.onAssigneesChange}
        />
      </div>

      <div className="issue-description">
        <h3>Description</h3>
        {props.issue.description ? (
          <TextEditor
            value={props.issue.description}
            format="md"
            mode="display"
          />
        ) : (
          <p className="no-description">No description provided</p>
        )}
      </div>

      <div className="issue-assets">
        <h3>Attachments</h3>
        {props.assets.length > 0 ? (
          <AssetUploader
            projectPath={props.projectPath}
            issueId={props.issueNumber}
            mode="edit"
            initialAssets={props.assets}
            onAssetsChange={props.onAssetsChange}
          />
        ) : (
          <p className="no-assets">No attachments</p>
        )}
      </div>

      <LinkSection
        entityId={props.issue.id}
        entityType="issue"
        editable={true}
      />
    </>
  )
}

function IssueModals({
  issue,
  projectPath,
  showMoveModal,
  showDuplicateModal,
  showStatusConfigDialog,
  onCloseMoveModal,
  onMoved,
  onCloseDuplicateModal,
  onDuplicated,
  onCloseStatusConfig,
  onStatusConfigured,
}: {
  issue: Issue | null
  projectPath: string
  showMoveModal: boolean
  showDuplicateModal: boolean
  showStatusConfigDialog: boolean
  onCloseMoveModal: () => void
  onMoved: (targetProjectPath: string) => void
  onCloseDuplicateModal: () => void
  onDuplicated: (newIssueId: string, targetProjectPath: string) => void
  onCloseStatusConfig: () => void
  onStatusConfigured: () => void
}) {
  return (
    <>
      {showMoveModal && issue && (
        <MoveModal
          entityType="issue"
          entityId={issue.id}
          entityTitle={issue.title}
          currentProjectPath={projectPath}
          onClose={onCloseMoveModal}
          onMoved={onMoved}
        />
      )}

      {showDuplicateModal && issue && (
        <DuplicateModal
          entityType="issue"
          entityId={issue.id}
          entityTitle={issue.title}
          currentProjectPath={projectPath}
          onClose={onCloseDuplicateModal}
          onDuplicated={onDuplicated}
        />
      )}

      {showStatusConfigDialog && projectPath && (
        <StatusConfigDialog
          projectPath={projectPath}
          onClose={onCloseStatusConfig}
          onConfigured={onStatusConfigured}
        />
      )}
    </>
  )
}

function useFetchIssue(
  projectPath: string,
  issueNumber: string,
  setIssue: (i: Issue | null) => void,
  setEditTitle: (t: string) => void,
  setEditDescription: (d: string) => void,
  setEditStatus: (s: string) => void,
  setEditPriority: (p: number) => void,
  setLoading: (l: boolean) => void,
  setError: (e: string | null) => void
) {
  return useCallback(async () => {
    if (!projectPath || !issueNumber) {
      setError('Missing project path or issue number')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const request = create(GetIssueRequestSchema, {
        projectPath,
        issueId: issueNumber,
      })
      const response = await centyClient.getIssue(request)
      if (response.issue) {
        setIssue(response.issue)
        setEditTitle(response.issue.title)
        setEditDescription(response.issue.description)
        setEditStatus(
          (response.issue.metadata && response.issue.metadata.status) || 'open'
        )
        setEditPriority(
          (response.issue.metadata && response.issue.metadata.priority) || 2
        )
      } else {
        setError(response.error || 'Issue not found')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [
    projectPath,
    issueNumber,
    setIssue,
    setEditTitle,
    setEditDescription,
    setEditStatus,
    setEditPriority,
    setLoading,
    setError,
  ])
}

function useFetchAssets(
  projectPath: string,
  issueNumber: string,
  setAssets: (a: Asset[]) => void
) {
  return useCallback(async () => {
    if (!projectPath || !issueNumber) return

    try {
      const request = create(ListAssetsRequestSchema, {
        projectPath,
        issueId: issueNumber,
      })
      const response = await centyClient.listAssets(request)
      setAssets(response.assets)
    } catch (err) {
      console.error('Failed to load assets:', err)
    }
  }, [projectPath, issueNumber, setAssets])
}

async function openInWorkspaceHelper(
  projectPath: string,
  issue: Issue,
  openFn: typeof centyClient.openInTempVscode,
  editorLabel: string,
  setOpeningInVscode: (v: boolean) => void,
  setError: (e: string | null) => void,
  setShowStatusConfigDialog: (v: boolean) => void
) {
  setOpeningInVscode(true)
  setError(null)
  try {
    const request = create(OpenInTempWorkspaceRequestSchema, {
      projectPath,
      issueId: issue.id,
      action: LlmAction.PLAN,
      agentName: '',
      ttlHours: 0,
    })
    const response = await openFn(request)
    if (response.success) {
      if (!response.editorOpened) {
        const actionWord = response.workspaceReused
          ? 'Reopened workspace'
          : 'Workspace created'
        setError(
          `${actionWord} at ${response.workspacePath} but ${editorLabel} could not be opened automatically`
        )
      }
    } else if (response.requiresStatusConfig) {
      setShowStatusConfigDialog(true)
    } else {
      setError(response.error || `Failed to open in ${editorLabel}`)
    }
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to connect to daemon')
  } finally {
    setOpeningInVscode(false)
  }
}

function useOpenInWorkspace(
  projectPath: string,
  issue: Issue | null,
  setOpeningInVscode: (v: boolean) => void,
  setError: (e: string | null) => void,
  setShowStatusConfigDialog: (v: boolean) => void
) {
  const handleOpenInVscode = useCallback(async () => {
    if (!projectPath || !issue) return
    await openInWorkspaceHelper(
      projectPath,
      issue,
      req => centyClient.openInTempVscode(req),
      'VS Code',
      setOpeningInVscode,
      setError,
      setShowStatusConfigDialog
    )
  }, [
    projectPath,
    issue,
    setOpeningInVscode,
    setError,
    setShowStatusConfigDialog,
  ])

  const handleOpenInTerminal = useCallback(async () => {
    if (!projectPath || !issue) return
    await openInWorkspaceHelper(
      projectPath,
      issue,
      req => centyClient.openInTempTerminal(req),
      'terminal',
      setOpeningInVscode,
      setError,
      setShowStatusConfigDialog
    )
  }, [
    projectPath,
    issue,
    setOpeningInVscode,
    setError,
    setShowStatusConfigDialog,
  ])

  return { handleOpenInVscode, handleOpenInTerminal }
}

function useStatusChange(
  projectPath: string,
  issueNumber: string,
  issue: Issue | null,
  setIssue: (i: Issue | null) => void,
  setEditStatus: (s: string) => void,
  setUpdatingStatus: (v: boolean) => void,
  setError: (e: string | null) => void,
  setShowStatusDropdown: (v: boolean) => void
) {
  return useCallback(
    async (newStatus: string) => {
      if (!projectPath || !issueNumber || !issue) return
      if (newStatus === (issue.metadata && issue.metadata.status)) {
        setShowStatusDropdown(false)
        return
      }

      setUpdatingStatus(true)
      setError(null)

      try {
        const request = create(UpdateIssueRequestSchema, {
          projectPath,
          issueId: issueNumber,
          status: newStatus,
        })
        const response = await centyClient.updateIssue(request)

        if (response.success && response.issue) {
          setIssue(response.issue)
          setEditStatus(
            (response.issue.metadata && response.issue.metadata.status) ||
              'open'
          )
        } else {
          setError(response.error || 'Failed to update status')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setUpdatingStatus(false)
        setShowStatusDropdown(false)
      }
    },
    [
      projectPath,
      issueNumber,
      issue,
      setIssue,
      setEditStatus,
      setUpdatingStatus,
      setError,
      setShowStatusDropdown,
    ]
  )
}

function useIssueSave(
  projectPath: string,
  issueNumber: string,
  editTitle: string,
  editDescription: string,
  editStatus: string,
  editPriority: number,
  setIssue: (i: Issue | null) => void,
  setIsEditing: (v: boolean) => void,
  setSaving: (v: boolean) => void,
  setError: (e: string | null) => void
) {
  return useCallback(async () => {
    if (!projectPath || !issueNumber) return

    setSaving(true)
    setError(null)

    try {
      const request = create(UpdateIssueRequestSchema, {
        projectPath,
        issueId: issueNumber,
        title: editTitle,
        description: editDescription,
        status: editStatus,
        priority: editPriority,
      })
      const response = await centyClient.updateIssue(request)

      if (response.success && response.issue) {
        setIssue(response.issue)
        setIsEditing(false)
      } else {
        setError(response.error || 'Failed to update issue')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setSaving(false)
    }
  }, [
    projectPath,
    issueNumber,
    editTitle,
    editDescription,
    editStatus,
    editPriority,
    setIssue,
    setIsEditing,
    setSaving,
    setError,
  ])
}

function useIssueDelete(
  projectPath: string,
  issueNumber: string,
  issuesListUrl: string,
  router: ReturnType<typeof useRouter>,
  setDeleting: (v: boolean) => void,
  setError: (e: string | null) => void,
  setShowDeleteConfirm: (v: boolean) => void
) {
  return useCallback(async () => {
    if (!projectPath || !issueNumber) return

    setDeleting(true)
    setError(null)

    try {
      const request = create(DeleteIssueRequestSchema, {
        projectPath,
        issueId: issueNumber,
      })
      const response = await centyClient.deleteIssue(request)

      if (response.success) {
        router.push(issuesListUrl)
      } else {
        setError(response.error || 'Failed to delete issue')
        setShowDeleteConfirm(false)
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
      setShowDeleteConfirm(false)
    } finally {
      setDeleting(false)
    }
  }, [
    projectPath,
    issueNumber,
    router,
    issuesListUrl,
    setDeleting,
    setError,
    setShowDeleteConfirm,
  ])
}

function useClickOutside(
  ref: React.RefObject<HTMLDivElement | null>,
  active: boolean,
  onOutside: () => void
) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !(event.target instanceof Node && ref.current.contains(event.target))
      ) {
        onOutside()
      }
    }

    if (active) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, active, onOutside])
}

function useIssueDetailDeps() {
  const router = useRouter()
  const { projectPath, isLoading: pathLoading } = usePathContext()
  useDaemonStatus()
  const { copyToClipboard } = useCopyToClipboard()
  const { recordLastSeen } = useLastSeenIssues()
  const stateManager = useStateManager()
  const stateOptions = stateManager.getStateOptions()
  const { createLink, createProjectLink } = useAppLink()
  const resolvePathToUrl = useProjectPathToUrl()
  const issuesListUrl = createLink('/issues')

  return {
    router,
    projectPath,
    pathLoading,
    copyToClipboard,
    recordLastSeen,
    stateManager,
    stateOptions,
    createLink,
    createProjectLink,
    resolvePathToUrl,
    issuesListUrl,
  }
}

function useIssueDetailFormState() {
  const [issue, setIssue] = useState<Issue | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editStatus, setEditStatus] = useState('')
  const [editPriority, setEditPriority] = useState(0)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showStatusDropdown, setShowStatusDropdown] = useState(false)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [showStatusConfigDialog, setShowStatusConfigDialog] = useState(false)
  const [openingInVscode, setOpeningInVscode] = useState(false)
  const [assignees, setAssignees] = useState<string[]>([])
  const statusDropdownRef = useRef<HTMLDivElement>(null)

  return {
    issue,
    setIssue,
    loading,
    setLoading,
    error,
    setError,
    isEditing,
    setIsEditing,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editStatus,
    setEditStatus,
    editPriority,
    setEditPriority,
    saving,
    setSaving,
    deleting,
    setDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    showStatusDropdown,
    setShowStatusDropdown,
    updatingStatus,
    setUpdatingStatus,
    assets,
    setAssets,
    showMoveModal,
    setShowMoveModal,
    showDuplicateModal,
    setShowDuplicateModal,
    showStatusConfigDialog,
    setShowStatusConfigDialog,
    openingInVscode,
    setOpeningInVscode,
    assignees,
    setAssignees,
    statusDropdownRef,
  }
}

function useIssueDetailCoreState() {
  const deps = useIssueDetailDeps()
  const formState = useIssueDetailFormState()
  return { ...deps, ...formState }
}

function useIssueNavHandlers(
  projectPath: string,
  router: ReturnType<typeof useRouter>,
  resolvePathToUrl: ReturnType<typeof useProjectPathToUrl>,
  createLink: ReturnType<typeof useAppLink>['createLink'],
  createProjectLink: ReturnType<typeof useAppLink>['createProjectLink'],
  issuesListUrl: string,
  setShowDuplicateModal: (v: boolean) => void
) {
  const handleMoved = useCallback(
    async (targetProjectPath: string) => {
      const result = await resolvePathToUrl(targetProjectPath)
      if (result) {
        router.push(
          createProjectLink(result.orgSlug, result.projectName, 'issues')
        )
      } else {
        router.push(issuesListUrl)
      }
    },
    [resolvePathToUrl, createProjectLink, router, issuesListUrl]
  )
  const handleDuplicated = useCallback(
    async (newIssueId: string, targetProjectPath: string) => {
      if (targetProjectPath === projectPath) {
        router.push(createLink(`/issues/${newIssueId}`))
      } else {
        const result = await resolvePathToUrl(targetProjectPath)
        if (result) {
          router.push(
            createProjectLink(
              result.orgSlug,
              result.projectName,
              `issues/${newIssueId}`
            )
          )
        } else {
          router.push(issuesListUrl)
        }
      }
      setShowDuplicateModal(false)
    },
    [
      projectPath,
      router,
      createLink,
      resolvePathToUrl,
      createProjectLink,
      issuesListUrl,
      setShowDuplicateModal,
    ]
  )
  return { handleMoved, handleDuplicated }
}

function useIssueDetailEffects(
  s: ReturnType<typeof useIssueDetailCoreState>,
  issueNumber: string,
  fetchIssue: () => Promise<void>,
  fetchAssets: () => Promise<void>
) {
  useEffect(() => {
    fetchIssue()
    fetchAssets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.projectPath, issueNumber])

  useEffect(() => {
    if (s.issue && s.issue.id) {
      s.recordLastSeen(s.issue.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.issue && s.issue.id])

  const closeStatusDropdown = useCallback(
    () => s.setShowStatusDropdown(false),
    [s]
  )
  useClickOutside(
    s.statusDropdownRef,
    s.showStatusDropdown,
    closeStatusDropdown
  )
}

function useIssueDetailCrudHandlers(
  s: ReturnType<typeof useIssueDetailCoreState>,
  issueNumber: string
) {
  const handleStatusChange = useStatusChange(
    s.projectPath,
    issueNumber,
    s.issue,
    s.setIssue,
    s.setEditStatus,
    s.setUpdatingStatus,
    s.setError,
    s.setShowStatusDropdown
  )
  const handleSave = useIssueSave(
    s.projectPath,
    issueNumber,
    s.editTitle,
    s.editDescription,
    s.editStatus,
    s.editPriority,
    s.setIssue,
    s.setIsEditing,
    s.setSaving,
    s.setError
  )
  const handleDelete = useIssueDelete(
    s.projectPath,
    issueNumber,
    s.issuesListUrl,
    s.router,
    s.setDeleting,
    s.setError,
    s.setShowDeleteConfirm
  )
  const handleCancelEdit = () => {
    s.setIsEditing(false)
    if (!s.issue) return
    s.setEditTitle(s.issue.title)
    s.setEditDescription(s.issue.description)
    s.setEditStatus((s.issue.metadata && s.issue.metadata.status) || 'open')
    s.setEditPriority((s.issue.metadata && s.issue.metadata.priority) || 2)
  }
  return { handleStatusChange, handleSave, handleDelete, handleCancelEdit }
}

function useIssueDetailHandlers(
  s: ReturnType<typeof useIssueDetailCoreState>,
  issueNumber: string
) {
  const crud = useIssueDetailCrudHandlers(s, issueNumber)
  const { handleOpenInVscode, handleOpenInTerminal } = useOpenInWorkspace(
    s.projectPath,
    s.issue,
    s.setOpeningInVscode,
    s.setError,
    s.setShowStatusConfigDialog
  )
  const { handleMoved, handleDuplicated } = useIssueNavHandlers(
    s.projectPath,
    s.router,
    s.resolvePathToUrl,
    s.createLink,
    s.createProjectLink,
    s.issuesListUrl,
    s.setShowDuplicateModal
  )
  const handleStatusConfigured = useCallback(() => {
    s.setShowStatusConfigDialog(false)
    handleOpenInVscode()
  }, [handleOpenInVscode, s])

  return {
    ...crud,
    handleOpenInVscode,
    handleOpenInTerminal,
    handleMoved,
    handleDuplicated,
    handleStatusConfigured,
  }
}

function useIssueDetailState(issueNumber: string) {
  const s = useIssueDetailCoreState()

  const fetchIssue = useFetchIssue(
    s.projectPath,
    issueNumber,
    s.setIssue,
    s.setEditTitle,
    s.setEditDescription,
    s.setEditStatus,
    s.setEditPriority,
    s.setLoading,
    s.setError
  )
  const fetchAssets = useFetchAssets(s.projectPath, issueNumber, s.setAssets)

  useIssueDetailEffects(s, issueNumber, fetchIssue, fetchAssets)

  const handlers = useIssueDetailHandlers(s, issueNumber)

  useSaveShortcut({
    onSave: handlers.handleSave,
    enabled: s.isEditing && !s.saving && !!s.editTitle.trim(),
  })

  return {
    ...s,
    ...handlers,
  }
}

function IssueDetailLoaded({
  state,
  issue,
  issueNumber,
}: {
  state: ReturnType<typeof useIssueDetailState>
  issue: Issue
  issueNumber: string
}) {
  return (
    <div className="issue-detail">
      <div className="issue-header">
        <Link href={state.issuesListUrl} className="back-link">
          Back to Issues
        </Link>
        <div className="issue-actions">
          <IssueHeaderActions
            isEditing={state.isEditing}
            openingInVscode={state.openingInVscode}
            saving={state.saving}
            onOpenInVscode={state.handleOpenInVscode}
            onOpenInTerminal={state.handleOpenInTerminal}
            onEdit={() => state.setIsEditing(true)}
            onMove={() => state.setShowMoveModal(true)}
            onDuplicate={() => state.setShowDuplicateModal(true)}
            onDelete={() => state.setShowDeleteConfirm(true)}
            onCancelEdit={state.handleCancelEdit}
            onSave={state.handleSave}
          />
        </div>
      </div>

      {state.error && <DaemonErrorMessage error={state.error} />}

      <DeleteConfirmSection
        showDeleteConfirm={state.showDeleteConfirm}
        deleting={state.deleting}
        onCancel={() => state.setShowDeleteConfirm(false)}
        onDelete={state.handleDelete}
      />

      <IssueContentSection
        state={state}
        issue={issue}
        issueNumber={issueNumber}
      />

      <IssueModals
        issue={issue}
        projectPath={state.projectPath}
        showMoveModal={state.showMoveModal}
        showDuplicateModal={state.showDuplicateModal}
        showStatusConfigDialog={state.showStatusConfigDialog}
        onCloseMoveModal={() => state.setShowMoveModal(false)}
        onMoved={state.handleMoved}
        onCloseDuplicateModal={() => state.setShowDuplicateModal(false)}
        onDuplicated={state.handleDuplicated}
        onCloseStatusConfig={() => state.setShowStatusConfigDialog(false)}
        onStatusConfigured={state.handleStatusConfigured}
      />
    </div>
  )
}

function IssueContentSection({
  state,
  issue,
  issueNumber,
}: {
  state: ReturnType<typeof useIssueDetailState>
  issue: Issue
  issueNumber: string
}) {
  return (
    <div className="issue-content">
      <button
        type="button"
        className="issue-number-badge"
        onClick={() =>
          issueNumber &&
          state.copyToClipboard(issueNumber, `issue #${issue.displayNumber}`)
        }
        title="Click to copy UUID"
      >
        #{issue.displayNumber}
      </button>

      {state.isEditing ? (
        <IssueEditForm
          editTitle={state.editTitle}
          editDescription={state.editDescription}
          editStatus={state.editStatus}
          editPriority={state.editPriority}
          stateOptions={state.stateOptions}
          projectPath={state.projectPath}
          issueNumber={issueNumber}
          assets={state.assets}
          onTitleChange={state.setEditTitle}
          onDescriptionChange={state.setEditDescription}
          onStatusChange={state.setEditStatus}
          onPriorityChange={state.setEditPriority}
          onAssetsChange={state.setAssets}
        />
      ) : (
        <IssueViewContent
          issue={issue}
          issueNumber={issueNumber}
          projectPath={state.projectPath}
          stateManager={state.stateManager}
          stateOptions={state.stateOptions}
          showStatusDropdown={state.showStatusDropdown}
          updatingStatus={state.updatingStatus}
          statusDropdownRef={state.statusDropdownRef}
          assets={state.assets}
          assignees={state.assignees}
          onToggleStatusDropdown={() =>
            state.setShowStatusDropdown(!state.showStatusDropdown)
          }
          onStatusChange={state.handleStatusChange}
          onAssetsChange={state.setAssets}
          onAssigneesChange={state.setAssignees}
        />
      )}
    </div>
  )
}

export function IssueDetail({ issueNumber }: IssueDetailProps) {
  const state = useIssueDetailState(issueNumber)

  if (!state.projectPath) {
    return (
      <div className="issue-detail">
        <DaemonErrorMessage error="No project path specified. Please go to the issues list and select a project." />
      </div>
    )
  }

  if (state.pathLoading || state.loading) {
    return (
      <div className="issue-detail">
        <div className="loading">Loading issue...</div>
      </div>
    )
  }

  if (state.error && !state.issue) {
    return (
      <div className="issue-detail">
        <DaemonErrorMessage error={state.error} />
        <Link href={state.issuesListUrl} className="back-link">
          Back to Issues
        </Link>
      </div>
    )
  }

  if (!state.issue) {
    return (
      <div className="issue-detail">
        <div className="error-message">Issue not found</div>
        <Link href={state.issuesListUrl} className="back-link">
          Back to Issues
        </Link>
      </div>
    )
  }

  return (
    <IssueDetailLoaded
      state={state}
      issue={state.issue}
      issueNumber={issueNumber}
    />
  )
}
