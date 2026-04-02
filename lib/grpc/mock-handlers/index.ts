'use client'

import { readHandlers } from './readHandlers'
import { writeHandlers } from './writeHandlers'

export const mockHandlers = {
  ...readHandlers,
  ...writeHandlers,
}
