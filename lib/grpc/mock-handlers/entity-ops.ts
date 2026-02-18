'use client'

import { DEMO_ISSUES, DEMO_DOCS } from '../demo-data'
import type { Issue, Doc } from '@/gen/centy_pb'

export async function moveIssue(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] moveIssue called - not available in demo mode')
  return { success: true }
}

export async function duplicateIssue(): Promise<{
  success: boolean
  issue: Issue
}> {
  console.warn('[Demo Mode] duplicateIssue called - not available in demo mode')
  return { success: true, issue: DEMO_ISSUES[0] }
}

export async function moveDoc(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] moveDoc called - not available in demo mode')
  return { success: true }
}

export async function duplicateDoc(): Promise<{
  success: boolean
  doc: Doc
}> {
  console.warn('[Demo Mode] duplicateDoc called - not available in demo mode')
  return { success: true, doc: DEMO_DOCS[0] }
}

export async function advancedSearch(): Promise<{
  issues: Issue[]
}> {
  return { issues: DEMO_ISSUES }
}

export async function getIssuesByUuid(): Promise<{
  issues: Issue[]
}> {
  return { issues: [] }
}

export async function getDocsBySlug(): Promise<{
  docs: Doc[]
}> {
  return { docs: [] }
}
