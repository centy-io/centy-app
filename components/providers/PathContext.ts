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
  navigateToProject: () => {},
}

export const PathContext = createContext<PathContextType>(DEFAULT_PATH_CONTEXT)
