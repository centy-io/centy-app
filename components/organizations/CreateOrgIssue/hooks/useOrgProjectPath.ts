import { useState, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema } from '@/gen/centy_pb'

export function useOrgProjectPath(orgSlug: string) {
  const [orgProjectPath, setOrgProjectPath] = useState<string | null>(null)
  const [initLoading, setInitLoading] = useState(true)

  useEffect(() => {
    if (!orgSlug) return
    setInitLoading(true)
    centyClient
      .listProjects(
        create(ListProjectsRequestSchema, { organizationSlug: orgSlug })
      )
      .then(res => {
        const initialized = res.projects.find(p => p.initialized)
        setOrgProjectPath(initialized ? initialized.path : null)
      })
      .catch(() => {
        setOrgProjectPath(null)
      })
      .finally(() => {
        setInitLoading(false)
      })
  }, [orgSlug])

  return { orgProjectPath, initLoading }
}
