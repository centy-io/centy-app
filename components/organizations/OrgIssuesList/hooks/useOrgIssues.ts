import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  ListIssuesRequestSchema,
  type Issue,
} from '@/gen/centy_pb'

async function fetchOrgIssuesFromProjects(
  orgSlug: string
): Promise<{ issues: Issue[]; firstProjectPath: string | null }> {
  const projectsRes = await centyClient.listProjects(
    create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
  )
  const orgProjects = projectsRes.projects.filter(p => p.initialized)
  const firstProjectPath =
    orgProjects.length > 0 ? orgProjects[0].path : null

  const seen = new Set<string>()
  const orgIssues: Issue[] = []

  await Promise.all(
    orgProjects.map(async project => {
      try {
        const res = await centyClient.listIssues(
          create(ListIssuesRequestSchema, { projectPath: project.path })
        )
        for (const issue of res.issues) {
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
      if (firstProjectPath && !orgProjectPath) {
        setOrgProjectPath(firstProjectPath)
      }
      setIssues(fetched)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issues')
    } finally {
      setLoading(false)
    }
  }, [orgSlug, orgProjectPath])

  useEffect(() => {
    fetchIssues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgSlug])

  return { issues, loading, error, orgProjectPath, fetchIssues }
}
