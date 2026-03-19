'use client'

// Collection of all mock handlers keyed by method name
// Handler functions have typed request parameters; any[] is required for index signature compatibility
export interface MockHandlers {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [key: string]: (...args: any[]) => unknown
}
