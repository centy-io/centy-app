import type { Route } from '@playwright/test'
import {
  createGrpcResponse,
  parseGrpcRequest,
  createGrpcHeaders,
  createGrpcError,
} from '../mocks/grpc-utils'
import type { HandlerConfig } from './mock-grpc-types'

/**
 * Creates a route handler function for intercepting gRPC-Web calls.
 */
export function createRouteHandler(
  handlers: Map<string, HandlerConfig>
): (route: Route) => Promise<void> {
  return async (route: Route) => {
    const url = route.request().url()
    const method = url.split('/').pop()

    if (!method) {
      await route.fulfill({
        status: 400,
        ...createGrpcError(3, 'Invalid request: no method specified'),
      })
      return
    }

    const handlerConfig = handlers.get(method)

    if (!handlerConfig) {
      // If no handler, return an error (can be configured to pass through)
      await route.fulfill({
        status: 200,
        ...createGrpcError(12, `Unimplemented method: ${method}`),
      })
      return
    }

    try {
      const postData = route.request().postDataBuffer()
      if (!postData) {
        await route.fulfill({
          status: 200,
          ...createGrpcError(3, 'Invalid request: no body'),
        })
        return
      }

      const request = parseGrpcRequest(handlerConfig.requestSchema, postData)
      const response = await handlerConfig.handler(request)
      const body = createGrpcResponse(handlerConfig.responseSchema, response)

      await route.fulfill({
        status: 200,
        headers: createGrpcHeaders(),
        body,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      await route.fulfill({
        status: 200,
        ...createGrpcError(13, message),
      })
    }
  }
}
