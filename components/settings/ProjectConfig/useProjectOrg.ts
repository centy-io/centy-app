'use client'

import { useState, useCallback } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetProjectInfoRequestSchema,
  SetProjectOrganizationRequestSchema,
} from '@/gen/centy_pb'

export function useProjectOrg(
  projectPath: string,
  refreshOrganizations: () => void,
  setError: (e: string | null) => void,
  setSuccess: (s: string | null) => void
) {
  const [projectOrgSlug, setProjectOrgSlug] = useState<string>('')
  const [savingOrg, setSavingOrg] = useState(false)

  const fetchProjectOrg = useCallback(async () => {
    if (!projectPath.trim()) return
    try {
      const request = create(GetProjectInfoRequestSchema, {
        projectPath: projectPath.trim(),
      })
      const response = await centyClient.getProjectInfo(request)
      if (response.found && response.project) {
        setProjectOrgSlug(response.project.organizationSlug || '')
      }
    } catch (err) {
      console.error('Failed to fetch project organization:', err)
    }
  }, [projectPath])

  const handleOrgChange = useCallback(
    async (newOrgSlug: string) => {
      if (!projectPath.trim()) return
      setSavingOrg(true)
      setError(null)
      setSuccess(null)
      try {
        const request = create(SetProjectOrganizationRequestSchema, {
          projectPath: projectPath.trim(),
          organizationSlug: newOrgSlug,
        })
        const response = await centyClient.setProjectOrganization(request)
        if (response.success) {
          setProjectOrgSlug(newOrgSlug)
          setSuccess(
            newOrgSlug
              ? 'Project assigned to organization'
              : 'Project removed from organization'
          )
          refreshOrganizations()
        } else {
          setError(response.error || 'Failed to update organization')
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setSavingOrg(false)
      }
    },
    [projectPath, refreshOrganizations, setError, setSuccess]
  )

  return {
    projectOrgSlug,
    savingOrg,
    fetchProjectOrg,
    handleOrgChange,
  }
}
