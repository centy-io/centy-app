import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListIssuesRequestSchema } from '@/gen/centy_pb'
import { getProjects } from '@/lib/project-resolver'
import type { AggregateIssue } from '../AggregateIssuesList.types'

export function useAggregateIssues() {
  const [issues, setIssues] = useState<AggregateIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllIssues = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const projects = await getProjects()
      const initializedProjects = projects.filter(p => p.initialized)

      const issuePromises = initializedProjects.map(async project => {
        try {
          const request = create(ListIssuesRequestSchema, {
            projectPath: project.path,
          })
          const response = await centyClient.listIssues(request)
          return response.issues.map(issue => ({
            ...issue,
            projectName: project.name,
            orgSlug: project.organizationSlug || null,
            projectPath: project.path,
          }))
        } catch {
          console.warn(`Failed to fetch issues from ${project.name}`)
          return []
        }
      })

      const issueArrays = await Promise.all(issuePromises)
      setIssues(issueArrays.flat())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issues')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllIssues()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { issues, loading, error, fetchAllIssues }
}
