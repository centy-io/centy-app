'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'

export function useProjectContext() {
  const params = useParams()
  return useMemo(() => {
    const orgP = params ? params.organization : undefined
    const org = typeof orgP === 'string' ? orgP : undefined
    const projP = params ? params.project : undefined
    const proj = typeof projP === 'string' ? projP : undefined
    if (org && proj) return { organization: org, project: proj }
    return null
  }, [params])
}
