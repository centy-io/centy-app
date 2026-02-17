'use client'

// Type for mock handlers - using 'any' to allow different parameter types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MockHandlers = Record<string, (request: any) => Promise<any>>
