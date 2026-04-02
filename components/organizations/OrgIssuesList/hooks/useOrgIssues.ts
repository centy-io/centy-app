import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  ListItemsRequestSchema,
  type Issue,
} from '@/gen/centy_pb'
import { genericItemToIssue } from '@/lib/genericItemToIssue'

async function fetchOrgIssuesFromProjects(
  orgSlug: string
): Promise<{ issues: Issue[]; firstProjectPath: string | null }> {
  const projectsRes = await centyClient.listProjects(
    create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
  )
  const orgProjects = projectsRes.projects.filter(p => p.initialized)
  const firstProjectPath = orgProjects.length > 0 ? orgProjects[0].path : null

  const seen = new Set<string>()
  const orgIssues: Issue[] = []

  await Promise.all(
    orgProjects.map(async project => {
      try {
        const res = await centyClient.listItems(
          create(ListItemsRequestSchema, {
            projectPath: project.path,
            itemType: 'issues',
          })
        )
        for (const issue of res.items.map(genericItemToIssue)) {
          const meta = issue.metadata
          if (!meta || !meta.isOrgIssue || meta.orgSlug !== orgSlug) continue
          if (seen.has(issue.id)) continue
          seen.add(issue.id)
          orgIssues.push(issue)
        }
      } catch {
        // non-fatal: skip projects that fail
      }
    })
  )

  orgIssues.sort((a, b) => {
    const aNum = a.metadata ? a.metadata.orgDisplayNumber : 0
    const bNum = b.metadata ? b.metadata.orgDisplayNumber : 0
    return aNum - bNum
  })
  return { issues: orgIssues, firstProjectPath }
}

export function useOrgIssues(orgSlug: string) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [orgProjectPath, setOrgProjectPath] = useState<string | null>(null)

  const fetchIssues = useCallback(async () => {
    if (!orgSlug) return
    setLoading(true)
    setError(null)
    try {
      const { issues: fetched, firstProjectPath } =
        await fetchOrgIssuesFromProjects(orgSlug)
      setOrgProjectPath(prev =>
        firstProjectPath && !prev ? firstProjectPath : prev
      )
      setIssues(fetched)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issues')
    } finally {
      setLoading(false)
    }
  }, [orgSlug])

  useEffect(() => {
    fetchIssues()
  }, [orgSlug, fetchIssues])

  return { issues, loading, error, orgProjectPath, fetchIssues }
}
