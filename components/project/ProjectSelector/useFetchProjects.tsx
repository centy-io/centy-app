'use client'

import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

export function useFetchProjects(
  selectedOrgSlug: string | null | undefined,
  setProjects: (p: ProjectInfo[]) => void
) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const req = create(ListProjectsRequestSchema, {
        includeStale: false,
        organizationSlug:
          selectedOrgSlug !== null &&
          selectedOrgSlug !== undefined &&
          selectedOrgSlug !== ''
            ? selectedOrgSlug
            : undefined,
        ungroupedOnly: selectedOrgSlug === '',
      })
      setProjects((await centyClient.listProjects(req)).projects)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }, [selectedOrgSlug, setProjects])
  return { loading, error, fetchProjects }
}
