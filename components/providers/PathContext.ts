'use client'

import { createContext } from 'react'
import type { PathContextType } from './PathContextProvider.types'

export const PathContext = createContext<PathContextType | null>(null)
