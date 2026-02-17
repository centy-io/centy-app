'use client'

import { DEMO_ISSUES, DEMO_DOCS } from '../demo-data'
import type { Issue, Doc } from '@/gen/centy_pb'
import type { MockHandlers } from './types'

// Stub handlers for read-only metadata and misc methods
export const stubHandlers: MockHandlers = {
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
    return { issues: DEMO_ISSUES }
  },

  async getInstruction(): Promise<{ content: string }> {
    return { content: '# Demo Project Instructions\n\nThis is a demo project.' }
  },

  async getCompact(): Promise<{ content: string }> {
    return { content: '# Compact Summary\n\nNo compacted issues yet.' }
  },

  async duplicateIssue(): Promise<{ success: boolean; issue: Issue }> {
    console.warn(
      '[Demo Mode] duplicateIssue called - not available in demo mode'
    )
    return { success: true, issue: DEMO_ISSUES[0] }
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
