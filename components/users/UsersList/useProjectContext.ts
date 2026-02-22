'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'

export function useProjectContext() {
  const params = useParams()
  return useMemo(() => {
    const orgParam = params ? params.organization : undefined
    const org = typeof orgParam === 'string' ? orgParam : undefined
    const projectParam = params ? params.project : undefined
    const project = typeof projectParam === 'string' ? projectParam : undefined
    if (org && project) return { organization: org, project }
    return null
  }, [params])
}
