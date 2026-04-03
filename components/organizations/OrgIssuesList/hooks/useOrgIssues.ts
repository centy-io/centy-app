import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  ListProjectsRequestSchema,
  ListItemsRequestSchema,
  type GenericItem,
} from '@/gen/centy_pb'

async function fetchOrgIssuesFromProjects(
  orgSlug: string
): Promise<{ issues: GenericItem[]; firstProjectPath: string | null }> {
  const projectsRes = await centyClient.listProjects(
    create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
  )
  const orgProjects = projectsRes.projects.filter(p => p.initialized)
  const firstProjectPath = orgProjects.length > 0 ? orgProjects[0].path : null

  const seen = new Set<string>()
  const orgIssues: GenericItem[] = []

  await Promise.all(
    orgProjects.map(async project => {
      try {
        const res = await centyClient.listItems(
          create(ListItemsRequestSchema, {
            projectPath: project.path,
            itemType: 'issues',
          })
        )
        for (const issue of res.items) {
          const meta = issue.metadata
          const cf = meta ? meta.customFields : {}
          if (!meta || cf.is_org_issue !== 'true' || cf.org_slug !== orgSlug)
            continue
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
    const aCf = a.metadata ? a.metadata.customFields : {}
    const bCf = b.metadata ? b.metadata.customFields : {}
    const aNum = parseInt(aCf.org_display_number || '0', 10)
    const bNum = parseInt(bCf.org_display_number || '0', 10)
    return aNum - bNum
  })
  return { issues: orgIssues, firstProjectPath }
}

export function useOrgIssues(orgSlug: string) {
  const [issues, setIssues] = useState<GenericItem[]>([])
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
    void fetchIssues()
  }, [orgSlug, fetchIssues])

  return { issues, loading, error, orgProjectPath, fetchIssues }
}
