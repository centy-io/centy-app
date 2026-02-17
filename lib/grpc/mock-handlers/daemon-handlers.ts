'use client'

import type { MockHandlers } from './types'

// Operations that don't make sense in demo mode
export const daemonHandlers: MockHandlers = {
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

  async spawnAgent(): Promise<{ success: boolean; message: string }> {
    console.warn('[Demo Mode] spawnAgent called - not available in demo mode')
    return { success: false, message: 'Not available in demo mode' }
  },

  async moveIssue(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] moveIssue called - not available in demo mode')
    return { success: true }
  },

  async moveDoc(): Promise<{ success: boolean }> {
    console.warn('[Demo Mode] moveDoc called - not available in demo mode')
    return { success: true }
  },
}
