'use client'

import { DEMO_ISSUES, DEMO_DOCS } from '../demo-data'
import type { Issue, Doc } from '@/gen/centy_pb'

// Write operations - return success responses but don't actually persist
// These will show a toast indicating changes aren't persisted

export async function createIssue(): Promise<{
  success: boolean
  issue: Issue
}> {
  console.warn('[Demo Mode] createIssue called - changes not persisted')
  return {
    success: true,
    issue: DEMO_ISSUES[0],
  }
}

export async function updateIssue(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateIssue called - changes not persisted')
  return { success: true }
}

export async function deleteIssue(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteIssue called - changes not persisted')
  return { success: true }
}

export async function createDoc(): Promise<{
  success: boolean
  doc: Doc
}> {
  console.warn('[Demo Mode] createDoc called - changes not persisted')
  return {
    success: true,
    doc: DEMO_DOCS[0],
  }
}

export async function updateDoc(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateDoc called - changes not persisted')
  return { success: true }
}

export async function deleteDoc(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteDoc called - changes not persisted')
  return { success: true }
}

export async function updateConfig(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateConfig called - changes not persisted')
  return { success: true }
}

export async function createUser(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] createUser called - changes not persisted')
  return { success: true }
}

export async function updateUser(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] updateUser called - changes not persisted')
  return { success: true }
}

export async function deleteUser(): Promise<{
  success: boolean
}> {
  console.warn('[Demo Mode] deleteUser called - changes not persisted')
  return { success: true }
}
