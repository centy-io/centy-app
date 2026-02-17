'use client'

import { createClient, Client } from '@connectrpc/connect'
import { createGrpcWebTransport } from '@connectrpc/connect-web'
import { mockHandlers } from '../mock-handlers'
import { CentyDaemon } from '@/gen/centy_pb'
import { trackGrpcCall } from '@/lib/metrics'
import { isDemoMode, enableDemoMode, disableDemoMode } from './demo-mode'
import { getDaemonUrl } from './daemon-url'
import type { CentyMockAPI } from './types'

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
    const value = target[prop as keyof typeof target]

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
      const boundFn = value.bind(target)
      return wrapWithMetrics(
        boundFn as (...args: unknown[]) => Promise<unknown>,
        prop
      )
    }

    return value
  },
})

// Expose mock mode API for E2E tests
if (typeof window !== 'undefined') {
  ;(window as Window & { __CENTY_MOCK__?: CentyMockAPI }).__CENTY_MOCK__ = {
    activate: enableDemoMode,
    deactivate: disableDemoMode,
    isActive: isDemoMode,
    setData: (data: Record<string, unknown>) => {
      // For future use: allow tests to inject custom mock data
      console.log('[Demo Mode] Custom data injection:', data)
    },
    reset: () => {
      disableDemoMode()
      if (typeof window !== 'undefined') {
        window.location.reload()
      }
    },
  }
}
