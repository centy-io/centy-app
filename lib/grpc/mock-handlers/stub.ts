'use client'

import { DEMO_ISSUES } from '../demo-data'
import type { Issue } from '@/gen/centy_pb'

// Stub handlers for other methods

export async function getManifest(): Promise<{
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
}

export async function getNextIssueNumber(): Promise<{
  nextNumber: number
}> {
  return { nextNumber: DEMO_ISSUES.length + 1 }
}

export async function getProjectVersion(): Promise<{
  projectVersion: string
  daemonVersion: string
}> {
  return {
    projectVersion: '0.1.5',
    daemonVersion: '0.1.5',
  }
}

export async function getFeatureStatus(): Promise<{
  features: Record<string, boolean>
}> {
  return { features: {} }
}

export async function listUncompactedIssues(): Promise<{
  issues: Issue[]
}> {
  return {
    issues: DEMO_ISSUES,
  }
}

export async function getInstruction(): Promise<{
  content: string
}> {
  return {
    content: '# Demo Project Instructions\n\nThis is a demo project.',
  }
}

export async function getCompact(): Promise<{
  content: string
}> {
  return {
    content: '# Compact Summary\n\nNo compacted issues yet.',
  }
}

export async function spawnAgent(): Promise<{
  success: boolean
  message: string
}> {
  console.warn('[Demo Mode] spawnAgent called - not available in demo mode')
  return {
    success: false,
    message: 'Not available in demo mode',
  }
}

export async function listItemTypes(): Promise<{
  success: boolean
  error: string
  itemTypes: Array<{ name: string; plural: string; identifier: string }>
  totalCount: number
}> {
  return {
    success: true,
    error: '',
    itemTypes: [
      { name: 'Issues', plural: 'issues', identifier: 'uuid' },
      { name: 'Docs', plural: 'docs', identifier: 'slug' },
    ],
    totalCount: 2,
  }
}
