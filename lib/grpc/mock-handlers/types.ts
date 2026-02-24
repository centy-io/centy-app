'use client'

// Collection of all mock handlers keyed by method name
export interface MockHandlers {
  readonly [key: string]: (...args: unknown[]) => unknown
}
