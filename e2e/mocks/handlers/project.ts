import type { GrpcMocker } from '../../utils/mock-grpc'
import {
  ListProjectsRequestSchema,
  ListProjectsResponseSchema,
  IsInitializedRequestSchema,
  IsInitializedResponseSchema,
  GetConfigRequestSchema,
  GetConfigResponseSchema,
  GetManifestRequestSchema,
  GetManifestResponseSchema,
  GetProjectInfoRequestSchema,
  GetProjectInfoResponseSchema,
} from '@/gen/centy_pb'
import type {
  ListProjectsResponse,
  IsInitializedResponse,
  Config,
  Manifest,
  GetConfigResponse,
  GetManifestResponse,
  GetProjectInfoResponse,
  ProjectInfo,
} from '@/gen/centy_pb'
import {
  mockConfig,
  mockManifest,
  mockProjectInfo,
} from '../../fixtures/config'

interface ProjectHandlerOptions {
  projects?: ProjectInfo[]
  isInitialized?: boolean
  config?: Config
  manifest?: Manifest
}

/**
 * Adds project-related handlers to the GrpcMocker.
 */
export function addProjectHandlers(
  mocker: GrpcMocker,
  options: ProjectHandlerOptions = {}
): GrpcMocker {
  const {
    projects = [mockProjectInfo],
    isInitialized = true,
    config = mockConfig,
    manifest = mockManifest,
  } = options

  // ListProjects - Also used as health check by DaemonStatusProvider
  mocker.addHandler(
    'ListProjects',
    ListProjectsRequestSchema,
    ListProjectsResponseSchema,
    (): ListProjectsResponse => ({
      projects,
      totalCount: projects.length,
      $typeName: 'centy.v1.ListProjectsResponse',
    })
  )

  // IsInitialized
  mocker.addHandler(
    'IsInitialized',
    IsInitializedRequestSchema,
    IsInitializedResponseSchema,
    (): IsInitializedResponse => ({
      initialized: isInitialized,
      centyPath: isInitialized ? '/test/project/.centy' : '',
      $typeName: 'centy.v1.IsInitializedResponse',
    })
  )

  // GetConfig
  mocker.addHandler(
    'GetConfig',
    GetConfigRequestSchema,
    GetConfigResponseSchema,
    (): GetConfigResponse => ({
      success: true,
      error: '',
      config,
      $typeName: 'centy.v1.GetConfigResponse',
    })
  )

  // GetManifest
  mocker.addHandler(
    'GetManifest',
    GetManifestRequestSchema,
    GetManifestResponseSchema,
    (): GetManifestResponse => ({
      success: true,
      error: '',
      manifest,
      $typeName: 'centy.v1.GetManifestResponse',
    })
  )

  // GetProjectInfo
  mocker.addHandler(
    'GetProjectInfo',
    GetProjectInfoRequestSchema,
    GetProjectInfoResponseSchema,
    (): GetProjectInfoResponse => ({
      found: projects.length > 0,
      project: projects[0],
      $typeName: 'centy.v1.GetProjectInfoResponse',
    })
  )

  return mocker
}

export type { ProjectHandlerOptions }
