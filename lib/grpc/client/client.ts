'use client'

import { createClient, Client } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { mockHandlers } from '../mock-handlers'
import { CentyDaemon } from '@/gen/centy_pb'
import { trackGrpcCall } from '@/lib/metrics'
import { isDemoMode } from './demo-mode'
import { getDaemonUrl } from './daemon-url'

const transport = createGrpcWebTransport({
  baseUrl: getDaemonUrl(),
})

// Create the real gRPC client
const realClient: Client<typeof CentyDaemon> = createClient(
  CentyDaemon,
  transport
)

// Helper to wrap a function with metrics tracking
function wrapWithMetrics(
  fn: (...args: unknown[]) => Promise<unknown>,
  methodName: string
): (...args: unknown[]) => Promise<unknown> {
  return async (...args: unknown[]) => {
    const start = performance.now()
    try {
      const result = await fn(...args)
      const duration = performance.now() - start
      trackGrpcCall(methodName, duration, true)
      return result
    } catch (error) {
      const duration = performance.now() - start
      trackGrpcCall(methodName, duration, false)
      throw error
    }
  }
}

// Create a proxy that intercepts calls for metrics and demo mode
export const centyClient: Client<typeof CentyDaemon> = new Proxy(realClient, {
  get(target, prop: string) {
    const clientRecord: Record<string, unknown> = target
    const value: unknown = clientRecord[prop]

    // If in demo mode, use mock handlers
    if (isDemoMode()) {
      if (typeof value === 'function') {
        const mockHandler = mockHandlers[prop]
        if (mockHandler) {
          return wrapWithMetrics(async (...args: unknown[]) => {
            try {
              return await mockHandler(args[0])
            } catch (error) {
              console.error(
                `[Demo Mode] Error in mock handler for ${prop}:`,
                error
              )
              throw error
            }
          }, prop)
        }
        // If no mock handler, still call the mock but log a warning
        console.warn(`[Demo Mode] No mock handler for method: ${prop}`)
        return async () => {
          throw new Error(`Method ${prop} is not available in demo mode`)
        }
      }
      return value
    }

    // Not in demo mode - wrap real client methods with metrics
    if (typeof value === 'function') {
      const boundFn: (...args: unknown[]) => Promise<unknown> = (
        ...args: unknown[]
      ) => Promise.resolve(value.apply(target, args))
      return wrapWithMetrics(boundFn, prop)
    }

    return value
  },
})
