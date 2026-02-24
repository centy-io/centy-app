'use client'

import { create } from '@bufbuild/protobuf'
import type { ProjectCache } from './ProjectCache'
import { centyClient } from './grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'
import { UnknownError } from '@/lib/errors'

const CACHE_TTL_MS = 30_000 // 30 seconds
let projectCache: ProjectCache | null = null

export const projectResolverState = {
  async fetchProjects(): Promise<ProjectInfo[]> {
    const now = Date.now()

    if (projectCache && now - projectCache.timestamp < CACHE_TTL_MS) {
      return projectCache.projects
    }

    try {
      const request = create(ListProjectsRequestSchema, {})
      const response = await centyClient.listProjects(request)
      const projects = response.projects

      projectCache = {
        projects,
        timestamp: now,
      }

      return projects
    } catch (error) {
      if (projectCache) {
        console.warn(
          '[ProjectResolver] Failed to refresh, using stale cache:',
          error
        )
        return projectCache.projects
      }
      throw error instanceof Error ? error : new UnknownError(error)
    }
  },

  clearCache(): void {
    projectCache = null
  },
}
