'use client'

import { DEMO_ISSUES, DEMO_DOCS } from '../demo-data'
import type { Issue, Doc } from '@/gen/centy_pb'
import type { MockHandlers } from './types'

// Write operations - return success responses but don't actually persist
// These will show a toast indicating changes aren't persisted
export const writeHandlers: MockHandlers = {
  async createIssue(): Promise<{ success: boolean; issue: Issue }> {
    console.warn('[Demo Mode] createIssue called - changes not persisted')
    return { success: true, issue: DEMO_ISSUES[0] }
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
    return { success: true, doc: DEMO_DOCS[0] }
  },

  async updateDoc(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] updateDoc called - changes not persisted')
    return { success: true }
  },

  async deleteDoc(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] deleteDoc called - changes not persisted')
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
}
