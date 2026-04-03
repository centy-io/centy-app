'use client'

import { usePathname } from 'next/navigation'
import { ReactNode, useMemo } from 'react'
import { IssueDetail } from '@/components/issues/IssueDetail'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

interface ClientRouteHandlerProps {
  children: ReactNode
}

export function ClientRouteHandler({ children }: ClientRouteHandlerProps) {
  const pathname = usePathname()
  useKeyboardNavigation()

  const routeContent = useMemo(() => {
    const pathParts = pathname.split('/').filter(Boolean)

    // Handle /issues/[issueNumber] routes
    if (pathParts[0] === 'issues' && pathParts[1] && pathParts[1] !== 'new') {
      return <IssueDetail issueNumber={pathParts[1]} />
    }

    // For all other routes, use the default children
    return null
  }, [pathname])

  // If we have a specific route to handle, render it; otherwise render children
  return <>{routeContent ?? children}</>
}
