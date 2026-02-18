import { useState, useCallback, useEffect, useMemo } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListIssuesRequestSchema } from '@/gen/centy_pb'
import { getProjects } from '@/lib/project-resolver'
import type { AggregateIssue } from '../AggregateIssuesList.types'
import { useOrgDisplayText } from './useOrgDisplayText'

export function useAggregateIssues() {
  const { selectedOrgSlug, getOrgDisplayName, getOrgNoteText, getEmptyText } =
    useOrgDisplayText()
  const [issues, setIssues] = useState<AggregateIssue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([
    { id: 'createdAt', desc: true },
  ])
  const [columnFilters, setColumnFilters] = useState<
    { id: string; value: unknown }[]
  >([])

  const filteredIssues = useMemo(() => {
    if (selectedOrgSlug === null) return issues
    if (selectedOrgSlug === '') {
      return issues.filter(issue => !issue.orgSlug)
    }
    return issues.filter(issue => issue.orgSlug === selectedOrgSlug)
  }, [issues, selectedOrgSlug])

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

  return {
    filteredIssues,
    loading,
    error,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    fetchAllIssues,
    getOrgDisplayName,
    getOrgNoteText,
    getEmptyText,
  }
}
