import { useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { getEditFieldsFromIssue } from './getEditFieldsFromIssue'
import { fetchOrgProjectPathAndStatuses } from './fetchOrgProjectPathAndStatuses'
import { centyClient } from '@/lib/grpc/client'
import { GetItemRequestSchema } from '@/gen/centy_pb'
import type { GenericItem } from '@/gen/centy_pb'

function formatErr(err: unknown): string {
  return err instanceof Error ? err.message : 'Failed to connect to daemon'
}

interface ApplyIssueParams {
  setEditTitle: (v: string) => void
  setEditDescription: (v: string) => void
  setEditPriority: (v: number) => void
  setEditStatus: (v: string) => void
}

function applyIssueToState(issue: GenericItem, p: ApplyIssueParams): void {
  const f = getEditFieldsFromIssue(issue)
  p.setEditTitle(f.title)
  p.setEditDescription(f.description)
  p.setEditPriority(f.priority)
  p.setEditStatus(f.status)
}

interface UseOrgIssueFetchParams {
  orgSlug: string
  issueId: string
  setLoading: (v: boolean) => void
  setError: (v: string | null) => void
  setOrgProjectPath: (v: string | null) => void
  setItemTypeStatuses: (v: string[]) => void
  setIssue: (v: GenericItem | null) => void
  setEditTitle: (v: string) => void
  setEditDescription: (v: string) => void
  setEditPriority: (v: number) => void
  setEditStatus: (v: string) => void
}

export function useOrgIssueFetch(params: UseOrgIssueFetchParams): void {
  const {
    orgSlug,
    issueId,
    setLoading,
    setError,
    setOrgProjectPath,
    setItemTypeStatuses,
    setIssue,
    setEditTitle,
    setEditDescription,
    setEditPriority,
    setEditStatus,
  } = params

  useEffect(() => {
    if (!orgSlug || !issueId) return
    setLoading(true)
    setError(null)
    fetchOrgProjectPathAndStatuses(orgSlug)
      .then(pathResult => {
        if (typeof pathResult === 'string') {
          setError(pathResult)
          setLoading(false)
          return
        }
        setOrgProjectPath(pathResult.projectPath)
        setItemTypeStatuses(pathResult.statuses)
        return centyClient.getItem(
          create(GetItemRequestSchema, {
            projectPath: pathResult.projectPath,
            itemType: 'issues',
            itemId: issueId,
          })
        )
      })
      .then(res => {
        if (!res) return
        if (res.item) {
          const found = res.item
          setIssue(found)
          applyIssueToState(found, {
            setEditTitle,
            setEditDescription,
            setEditPriority,
            setEditStatus,
          })
        } else {
          setError(res.error || 'Issue not found')
        }
      })
      .catch((err: unknown) => {
        setError(formatErr(err))
      })
      .finally(() => {
        setLoading(false)
      })
  }, [orgSlug, issueId])
}
