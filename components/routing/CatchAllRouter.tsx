'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useMemo, useEffect } from 'react'
import { PathContextProvider } from '@/components/providers/PathContextProvider'
import { resolveRoute } from './routeConfig'

/**
 * Client-side router for catch-all paths
 *
 * Parses the pathname and renders the appropriate component for
 * [organization]/[project]/... paths that don't match explicit routes.
 *
 * Routes like /issues, /docs, /users require project context
 * and will show a message directing users to select a project.
 */
export function CatchAllRouter() {
  const pathname = usePathname()
  const router = useRouter()

  const { content, shouldRedirect, redirectTo } = useMemo(
    () => resolveRoute(pathname),
    [pathname]
  )

  useEffect(() => {
    if (shouldRedirect && redirectTo) {
      router.replace(redirectTo)
    }
  }, [shouldRedirect, redirectTo, router])

  if (shouldRedirect) {
    return null
  }

  return <PathContextProvider>{content}</PathContextProvider>
}
