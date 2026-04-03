'use client'

import { createContext } from 'react'
import type { PathContextType } from './PathContextProvider.types'

const DEFAULT_PATH_CONTEXT: PathContextType = {
  orgSlug: null,
  projectName: null,
  projectPath: '',
  isInitialized: false,
  displayPath: '',
  isAggregateView: false,
  isLoading: false,
  error: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  navigateToProject: () => {},
}

export const PathContext = createContext<PathContextType>(DEFAULT_PATH_CONTEXT)
