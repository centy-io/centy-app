'use client'

import {
  DEMO_PROJECT_PATH,
  DEMO_PROJECT,
  DEMO_ORGANIZATION,
  DEMO_ISSUES,
  DEMO_DOCS,
  DEMO_USERS,
  DEMO_CONFIG,
  DEMO_DAEMON_INFO,
  DEMO_LINKS,
  DEMO_ASSETS,
} from './demo-data'

import type {
  ListProjectsRequest,
  ListProjectsResponse,
  GetProjectInfoRequest,
  GetProjectInfoResponse,
  ListIssuesRequest,
  ListIssuesResponse,
  GetIssueRequest,
  GetIssueByDisplayNumberRequest,
  Issue,
  ListDocsRequest,
  ListDocsResponse,
  GetDocRequest,
  Doc,
  ListUsersRequest,
  ListUsersResponse,
  GetUserRequest,
  User,
  ListOrganizationsRequest,
  ListOrganizationsResponse,
  GetOrganizationRequest,
  Organization,
  GetConfigRequest,
  Config,
  GetDaemonInfoRequest,
  DaemonInfo,
  IsInitializedRequest,
  IsInitializedResponse,
  ListLinksRequest,
  ListLinksResponse,
  ListAssetsRequest,
  ListAssetsResponse,
  GetAvailableLinkTypesRequest,
  GetAvailableLinkTypesResponse,
} from '@/gen/centy_pb'

// Type for mock handlers - using 'any' to allow different parameter types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MockHandlers = Record<string, (request: any) => Promise<any>>

// Helper to filter issues by request parameters
function filterIssues(
  issues: typeof DEMO_ISSUES,
  request: ListIssuesRequest
): typeof DEMO_ISSUES {
  let filtered = [...issues]

  // status is a single string, filter if provided
  if (request.status) {
    filtered = filtered.filter(
      issue => issue.metadata && issue.metadata.status === request.status
    )
  }

  // priority is a single number, filter if > 0
  if (request.priority && request.priority > 0) {
    filtered = filtered.filter(
      issue => issue.metadata && issue.metadata.priority === request.priority
    )
  }

  return filtered
}

// Mock handlers for all RPC methods
export const mockHandlers: MockHandlers = {
  // Project methods
  async listProjects(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _request: ListProjectsRequest
  ): Promise<ListProjectsResponse> {
    return {
      $typeName: 'centy.v1.ListProjectsResponse',
      projects: [DEMO_PROJECT],
      totalCount: 1,
      success: true,
      error: '',
    }
  },

  async getProjectInfo(
    request: GetProjectInfoRequest
  ): Promise<GetProjectInfoResponse> {
    if (request.projectPath === DEMO_PROJECT_PATH) {
      return {
        $typeName: 'centy.v1.GetProjectInfoResponse',
        found: true,
        project: DEMO_PROJECT,
        success: true,
        error: '',
      }
    }
    return {
      $typeName: 'centy.v1.GetProjectInfoResponse',
      found: false,
      project: undefined,
      success: true,
      error: '',
    }
  },

  async isInitialized(
    request: IsInitializedRequest
  ): Promise<IsInitializedResponse> {
    return {
      $typeName: 'centy.v1.IsInitializedResponse',
      initialized: request.projectPath === DEMO_PROJECT_PATH,
      centyPath:
        request.projectPath === DEMO_PROJECT_PATH
          ? `${DEMO_PROJECT_PATH}/.centy`
          : '',
    }
  },

  // Issue methods
  async listIssues(request: ListIssuesRequest): Promise<ListIssuesResponse> {
    if (request.projectPath !== DEMO_PROJECT_PATH) {
      return {
        $typeName: 'centy.v1.ListIssuesResponse',
        issues: [],
        totalCount: 0,
        success: true,
        error: '',
      }
    }

    const filtered = filterIssues(DEMO_ISSUES, request)
    return {
      $typeName: 'centy.v1.ListIssuesResponse',
      issues: filtered,
      totalCount: filtered.length,
      success: true,
      error: '',
    }
  },

  async getIssue(
    request: GetIssueRequest
  ): Promise<{ success: boolean; error: string; issue?: Issue }> {
    const issue = DEMO_ISSUES.find(i => i.id === request.issueId)
    if (issue) {
      return { success: true, error: '', issue }
    }
    return { success: false, error: `Issue ${request.issueId} not found` }
  },

  async getIssueByDisplayNumber(
    request: GetIssueByDisplayNumberRequest
  ): Promise<{ success: boolean; error: string; issue?: Issue }> {
    const issue = DEMO_ISSUES.find(
      i => i.displayNumber === request.displayNumber
    )
    if (issue) {
      return { success: true, error: '', issue }
    }
    return {
      success: false,
      error: `Issue #${request.displayNumber} not found`,
    }
  },

  // Doc methods
  async listDocs(request: ListDocsRequest): Promise<ListDocsResponse> {
    if (request.projectPath !== DEMO_PROJECT_PATH) {
      return {
        $typeName: 'centy.v1.ListDocsResponse',
        docs: [],
        totalCount: 0,
        success: true,
        error: '',
      }
    }

    return {
      $typeName: 'centy.v1.ListDocsResponse',
      docs: DEMO_DOCS,
      totalCount: DEMO_DOCS.length,
      success: true,
      error: '',
    }
  },

  async getDoc(
    request: GetDocRequest
  ): Promise<{ success: boolean; error: string; doc?: Doc }> {
    const doc = DEMO_DOCS.find(d => d.slug === request.slug)
    if (doc) {
      return { success: true, error: '', doc }
    }
    return { success: false, error: `Doc ${request.slug} not found` }
  },

  // User methods
  async listUsers(request: ListUsersRequest): Promise<ListUsersResponse> {
    if (request.projectPath !== DEMO_PROJECT_PATH) {
      return {
        $typeName: 'centy.v1.ListUsersResponse',
        users: [],
        totalCount: 0,
        success: true,
        error: '',
      }
    }

    return {
      $typeName: 'centy.v1.ListUsersResponse',
      users: DEMO_USERS,
      totalCount: DEMO_USERS.length,
      success: true,
      error: '',
    }
  },

  async getUser(request: GetUserRequest): Promise<User> {
    const user = DEMO_USERS.find(u => u.id === request.userId)
    if (user) {
      return user
    }
    throw new Error(`User ${request.userId} not found`)
  },

  // Organization methods
  async listOrganizations(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _request: ListOrganizationsRequest
  ): Promise<ListOrganizationsResponse> {
    return {
      $typeName: 'centy.v1.ListOrganizationsResponse',
      organizations: [DEMO_ORGANIZATION],
      totalCount: 1,
      success: true,
      error: '',
    }
  },

  async getOrganization(
    request: GetOrganizationRequest
  ): Promise<Organization> {
    if (request.slug === DEMO_ORGANIZATION.slug) {
      return DEMO_ORGANIZATION
    }
    throw new Error(`Organization ${request.slug} not found`)
  },

  // Config methods
  async getConfig(
    request: GetConfigRequest
  ): Promise<{ success: boolean; error: string; config: Config }> {
    if (request.projectPath === DEMO_PROJECT_PATH) {
      return { success: true, error: '', config: DEMO_CONFIG }
    }
    // Return default config for other projects
    return { success: true, error: '', config: DEMO_CONFIG }
  },

  // Daemon info
  async getDaemonInfo(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _request: GetDaemonInfoRequest
  ): Promise<DaemonInfo> {
    return DEMO_DAEMON_INFO
  },

  // Links
  async listLinks(request: ListLinksRequest): Promise<ListLinksResponse> {
    const links = DEMO_LINKS.filter(link => link.targetId === request.entityId)

    return {
      $typeName: 'centy.v1.ListLinksResponse',
      links,
      totalCount: links.length,
      success: true,
      error: '',
    }
  },

  async getAvailableLinkTypes(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _request: GetAvailableLinkTypesRequest
  ): Promise<GetAvailableLinkTypesResponse> {
    return {
      $typeName: 'centy.v1.GetAvailableLinkTypesResponse',
      linkTypes: [
        {
          $typeName: 'centy.v1.LinkTypeInfo',
          name: 'blocks',
          inverse: 'blocked-by',
          description: 'Blocks another issue from being worked on',
          isBuiltin: true,
        },
        {
          $typeName: 'centy.v1.LinkTypeInfo',
          name: 'fixes',
          inverse: 'fixed-by',
          description: 'Fixes the linked issue',
          isBuiltin: true,
        },
        {
          $typeName: 'centy.v1.LinkTypeInfo',
          name: 'implements',
          inverse: 'implemented-by',
          description: 'Implements a feature or requirement',
          isBuiltin: true,
        },
        {
          $typeName: 'centy.v1.LinkTypeInfo',
          name: 'relates-to',
          inverse: 'relates-to',
          description: 'Related to another issue',
          isBuiltin: true,
        },
        {
          $typeName: 'centy.v1.LinkTypeInfo',
          name: 'duplicates',
          inverse: 'duplicated-by',
          description: 'Duplicates another issue',
          isBuiltin: true,
        },
      ],
    }
  },

  // Assets
  async listAssets(request: ListAssetsRequest): Promise<ListAssetsResponse> {
    if (request.projectPath !== DEMO_PROJECT_PATH) {
      return {
        $typeName: 'centy.v1.ListAssetsResponse',
        assets: [],
        totalCount: 0,
        success: true,
        error: '',
      }
    }

    return {
      $typeName: 'centy.v1.ListAssetsResponse',
      assets: DEMO_ASSETS,
      totalCount: DEMO_ASSETS.length,
      success: true,
      error: '',
    }
  },

  async listSharedAssets(
    request: ListAssetsRequest
  ): Promise<ListAssetsResponse> {
    if (request.projectPath !== DEMO_PROJECT_PATH) {
      return {
        $typeName: 'centy.v1.ListAssetsResponse',
        assets: [],
        totalCount: 0,
        success: true,
        error: '',
      }
    }

    return {
      $typeName: 'centy.v1.ListAssetsResponse',
      assets: DEMO_ASSETS,
      totalCount: DEMO_ASSETS.length,
      success: true,
      error: '',
    }
  },

  // Write operations - return success responses but don't actually persist
  // These will show a toast indicating changes aren't persisted

  async createIssue(): Promise<{ success: boolean; issue: Issue }> {
    console.warn('[Demo Mode] createIssue called - changes not persisted')
    return {
      success: true,
      issue: DEMO_ISSUES[0],
    }
  },

  async updateIssue(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] updateIssue called - changes not persisted')
    return { success: true }
  },

  async deleteIssue(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] deleteIssue called - changes not persisted')
    return { success: true }
  },

  async createDoc(): Promise<{ success: boolean; doc: Doc }> {
    console.warn('[Demo Mode] createDoc called - changes not persisted')
    return {
      success: true,
      doc: DEMO_DOCS[0],
    }
  },

  async updateDoc(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] updateDoc called - changes not persisted')
    return { success: true }
  },

  async deleteDoc(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] deleteDoc called - changes not persisted')
    return { success: true }
  },

  // Operations that don't make sense in demo mode
  async shutdown(): Promise<{ success: boolean; message: string }> {
    console.warn('[Demo Mode] shutdown called - not available in demo mode')
    return { success: false, message: 'Not available in demo mode' }
  },

  async restart(): Promise<{ success: boolean; message: string }> {
    console.warn('[Demo Mode] restart called - not available in demo mode')
    return { success: false, message: 'Not available in demo mode' }
  },

  async init(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] init called - not available in demo mode')
    return { success: true }
  },

  async registerProject(): Promise<{ success: boolean }> {
    console.warn(
      '[Demo Mode] registerProject called - not available in demo mode'
    )
    return { success: true }
  },

  async untrackProject(): Promise<{ success: boolean }> {
    console.warn(
      '[Demo Mode] untrackProject called - not available in demo mode'
    )
    return { success: true }
  },

  async setProjectFavorite(): Promise<{ success: boolean }> {
    console.warn(
      '[Demo Mode] setProjectFavorite called - changes not persisted'
    )
    return { success: true }
  },

  async setProjectArchived(): Promise<{ success: boolean }> {
    console.warn(
      '[Demo Mode] setProjectArchived called - changes not persisted'
    )
    return { success: true }
  },

  async setProjectOrganization(): Promise<{ success: boolean }> {
    console.warn(
      '[Demo Mode] setProjectOrganization called - changes not persisted'
    )
    return { success: true }
  },

  async setProjectUserTitle(): Promise<{ success: boolean }> {
    console.warn(
      '[Demo Mode] setProjectUserTitle called - changes not persisted'
    )
    return { success: true }
  },

  async setProjectTitle(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] setProjectTitle called - changes not persisted')
    return { success: true }
  },

  async createOrganization(): Promise<{ success: boolean }> {
    console.warn(
      '[Demo Mode] createOrganization called - changes not persisted'
    )
    return { success: true }
  },

  async updateOrganization(): Promise<{ success: boolean }> {
    console.warn(
      '[Demo Mode] updateOrganization called - changes not persisted'
    )
    return { success: true }
  },

  async deleteOrganization(): Promise<{ success: boolean }> {
    console.warn(
      '[Demo Mode] deleteOrganization called - changes not persisted'
    )
    return { success: true }
  },

  async updateConfig(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] updateConfig called - changes not persisted')
    return { success: true }
  },

  async createUser(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] createUser called - changes not persisted')
    return { success: true }
  },

  async updateUser(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] updateUser called - changes not persisted')
    return { success: true }
  },

  async deleteUser(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] deleteUser called - changes not persisted')
    return { success: true }
  },

  async syncUsers(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] syncUsers called - not available in demo mode')
    return { success: true }
  },

  async createLink(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] createLink called - changes not persisted')
    return { success: true }
  },

  async deleteLink(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] deleteLink called - changes not persisted')
    return { success: true }
  },

  async addAsset(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] addAsset called - not available in demo mode')
    return { success: true }
  },

  async deleteAsset(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] deleteAsset called - not available in demo mode')
    return { success: true }
  },

  async getAsset(): Promise<{ success: boolean; data: Uint8Array }> {
    console.warn('[Demo Mode] getAsset called - returning empty data')
    return { success: true, data: new Uint8Array() }
  },

  // Stub handlers for other methods
  async getManifest(): Promise<{
    success: boolean
    error: string
    manifest: {
      schemaVersion: number
      centyVersion: string
      createdAt: string
      updatedAt: string
      $typeName: 'centy.v1.Manifest'
    }
  }> {
    return {
      success: true,
      error: '',
      manifest: {
        schemaVersion: 1,
        centyVersion: '0.1.5',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        $typeName: 'centy.v1.Manifest',
      },
    }
  },

  async getNextIssueNumber(): Promise<{ nextNumber: number }> {
    return { nextNumber: DEMO_ISSUES.length + 1 }
  },

  async getProjectVersion(): Promise<{
    projectVersion: string
    daemonVersion: string
  }> {
    return { projectVersion: '0.1.5', daemonVersion: '0.1.5' }
  },

  async getFeatureStatus(): Promise<{ features: Record<string, boolean> }> {
    return { features: {} }
  },

  async listUncompactedIssues(): Promise<{ issues: Issue[] }> {
    return {
      issues: DEMO_ISSUES,
    }
  },

  async getInstruction(): Promise<{ content: string }> {
    return { content: '# Demo Project Instructions\n\nThis is a demo project.' }
  },

  async getCompact(): Promise<{ content: string }> {
    return { content: '# Compact Summary\n\nNo compacted issues yet.' }
  },

  async spawnAgent(): Promise<{ success: boolean; message: string }> {
    console.warn('[Demo Mode] spawnAgent called - not available in demo mode')
    return { success: false, message: 'Not available in demo mode' }
  },

  async openInTempVscode(): Promise<{
    success: boolean
    error: string
    workspacePath: string
    issueId: string
    displayNumber: number
    expiresAt: string
    editorOpened: boolean
  }> {
    console.warn(
      '[Demo Mode] openInTempVscode called - not available in demo mode'
    )
    return {
      success: false,
      error: 'Opening VS Code workspaces is not available in demo mode',
      workspacePath: '',
      issueId: '',
      displayNumber: 0,
      expiresAt: '',
      editorOpened: false,
    }
  },

  async openInTempTerminal(): Promise<{
    success: boolean
    error: string
    workspacePath: string
    issueId: string
    displayNumber: number
    expiresAt: string
    editorOpened: boolean
  }> {
    console.warn(
      '[Demo Mode] openInTempTerminal called - not available in demo mode'
    )
    return {
      success: false,
      error: 'Opening Terminal workspaces is not available in demo mode',
      workspacePath: '',
      issueId: '',
      displayNumber: 0,
      expiresAt: '',
      editorOpened: false,
    }
  },

  async getSupportedEditors(): Promise<{
    editors: Array<{
      $typeName: 'centy.v1.EditorInfo'
      editorType: number
      name: string
      description: string
      available: boolean
      editorId: string
      terminalWrapper: boolean
    }>
  }> {
    return {
      editors: [
        {
          $typeName: 'centy.v1.EditorInfo',
          editorType: 1, // VSCODE
          name: 'VS Code',
          description: 'Open in temporary VS Code workspace with AI agent',
          available: true,
          editorId: 'vscode',
          terminalWrapper: false,
        },
        {
          $typeName: 'centy.v1.EditorInfo',
          editorType: 2, // TERMINAL
          name: 'Terminal',
          description: 'Open in terminal with AI agent',
          available: true,
          editorId: 'terminal',
          terminalWrapper: true,
        },
      ],
    }
  },

  async moveIssue(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] moveIssue called - not available in demo mode')
    return { success: true }
  },

  async duplicateIssue(): Promise<{ success: boolean; issue: Issue }> {
    console.warn(
      '[Demo Mode] duplicateIssue called - not available in demo mode'
    )
    return { success: true, issue: DEMO_ISSUES[0] }
  },

  async moveDoc(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] moveDoc called - not available in demo mode')
    return { success: true }
  },

  async duplicateDoc(): Promise<{ success: boolean; doc: Doc }> {
    console.warn('[Demo Mode] duplicateDoc called - not available in demo mode')
    return { success: true, doc: DEMO_DOCS[0] }
  },

  async advancedSearch(): Promise<{ issues: Issue[] }> {
    return { issues: DEMO_ISSUES }
  },

  async getIssuesByUuid(): Promise<{ issues: Issue[] }> {
    return { issues: [] }
  },

  async getDocsBySlug(): Promise<{ docs: Doc[] }> {
    return { docs: [] }
  },
}
