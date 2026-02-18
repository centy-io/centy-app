'use client'

// Type for mock handlers - using 'any' to allow different parameter types
export type MockHandlers = Record<
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (request: any) => Promise<any>
>
