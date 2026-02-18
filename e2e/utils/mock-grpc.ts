import type { Page } from '@playwright/test'
import type { DescMessage } from '@bufbuild/protobuf'
import type { GrpcHandler, HandlerConfig } from './mock-grpc-types'
import { createRouteHandler } from './mock-grpc-route-handler'

/**
 * GrpcMocker - A utility for mocking gRPC-Web calls in Playwright tests.
 * Intercepts HTTP requests to the daemon URL and returns mock responses.
 */
export class GrpcMocker {
  private page: Page
  private handlers: Map<string, HandlerConfig>
  private daemonUrl: string
  private isSetup: boolean

  constructor(page: Page, daemonUrl?: string) {
    this.page = page
    /* eslint-disable default/no-localhost, default/no-hardcoded-urls */
    this.daemonUrl =
      daemonUrl !== undefined ? daemonUrl : 'http://localhost:50051'
    /* eslint-enable default/no-localhost, default/no-hardcoded-urls */
    this.handlers = new Map()
    this.isSetup = false
  }

  /**
   * Add a handler for a specific gRPC method.
   */
  addHandler<Req extends DescMessage, Res extends DescMessage>(
    method: string,
    requestSchema: Req,
    responseSchema: Res,
    handler: GrpcHandler<Req, Res>
  ): this {
    const config: HandlerConfig = {
      requestSchema,
      responseSchema,
      handler,
    }
    this.handlers.set(method, config)
    return this
  }

  /**
   * Remove a handler for a specific gRPC method.
   */
  removeHandler(method: string): this {
    this.handlers.delete(method)
    return this
  }

  /**
   * Set up route interception. Call this before navigating to any page.
   */
  async setup(): Promise<void> {
    if (this.isSetup) return

    await this.page.route(
      `${this.daemonUrl}/centy.CentyDaemon/**`,
      createRouteHandler(this.handlers)
    )

    this.isSetup = true
  }

  /**
   * Clean up route interception.
   */
  async teardown(): Promise<void> {
    if (!this.isSetup) return

    await this.page.unroute(`${this.daemonUrl}/centy.CentyDaemon/**`)
    this.handlers.clear()
    this.isSetup = false
  }
}

/**
 * Create a GrpcMocker instance with common handlers pre-configured.
 */
export function createGrpcMocker(page: Page, daemonUrl?: string): GrpcMocker {
  return new GrpcMocker(page, daemonUrl)
}
