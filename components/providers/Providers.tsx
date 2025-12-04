'use client'

import { Suspense, type ReactNode } from 'react'
import { Toaster } from 'sonner'
import { DaemonStatusProvider } from './DaemonStatusProvider'
import { ProjectProvider } from './ProjectProvider'

function ProjectProviderWithSuspense({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <ProjectProvider>{children}</ProjectProvider>
    </Suspense>
  )
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <DaemonStatusProvider>
      <ProjectProviderWithSuspense>
        <Toaster position="bottom-right" richColors />
        {children}
      </ProjectProviderWithSuspense>
    </DaemonStatusProvider>
  )
}
