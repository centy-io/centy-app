/* eslint-disable max-lines */
'use client'

import { listProjects, getProjectInfo, isInitialized } from './project'
import { listIssues, getIssue, getIssueByDisplayNumber } from './issue'
import { listDocs, getDoc } from './doc'
import { listUsers, getUser } from './user'
import { listOrganizations, getOrganization } from './org'
import { getConfig, getDaemonInfo } from './config'
import { listLinks, getAvailableLinkTypes } from './link'
import { listAssets, listSharedAssets } from './asset'
import {
  createIssue,
  updateIssue,
  deleteIssue,
  createDoc,
  updateDoc,
  deleteDoc,
  updateConfig,
  createUser,
  updateUser,
  deleteUser,
} from './write'
import {
  shutdown,
  restart,
  init,
  registerProject,
  untrackProject,
  setProjectFavorite,
  setProjectArchived,
  setProjectOrganization,
  setProjectUserTitle,
  setProjectTitle,
} from './daemon'
import {
  createOrganization,
  updateOrganization,
  deleteOrganization,
  syncUsers,
  createLink,
  deleteLink,
  addAsset,
  deleteAsset,
  getAsset,
} from './org-write'
import {
  getManifest,
  getNextIssueNumber,
  getProjectVersion,
  getFeatureStatus,
  listUncompactedIssues,
  getInstruction,
  getCompact,
  spawnAgent,
} from './stub'
import {
  openInTempVscode,
  openInTempTerminal,
  getSupportedEditors,
} from './workspace'
import {
  moveIssue,
  duplicateIssue,
  moveDoc,
  duplicateDoc,
  advancedSearch,
  getIssuesByUuid,
  getDocsBySlug,
} from './entity-ops'
import { type MockHandlers } from './types'

export type { MockHandlers } from './types'

// Mock handlers for all RPC methods
export const mockHandlers: MockHandlers = {
  listProjects,
  getProjectInfo,
  isInitialized,
  listIssues,
  getIssue,
  getIssueByDisplayNumber,
  listDocs,
  getDoc,
  listUsers,
  getUser,
  listOrganizations,
  getOrganization,
  getConfig,
  getDaemonInfo,
  listLinks,
  getAvailableLinkTypes,
  listAssets,
  listSharedAssets,
  createIssue,
  updateIssue,
  deleteIssue,
  createDoc,
  updateDoc,
  deleteDoc,
  updateConfig,
  createUser,
  updateUser,
  deleteUser,
  shutdown,
  restart,
  init,
  registerProject,
  untrackProject,
  setProjectFavorite,
  setProjectArchived,
  setProjectOrganization,
  setProjectUserTitle,
  setProjectTitle,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  syncUsers,
  createLink,
  deleteLink,
  addAsset,
  deleteAsset,
  getAsset,
  getManifest,
  getNextIssueNumber,
  getProjectVersion,
  getFeatureStatus,
  listUncompactedIssues,
  getInstruction,
  getCompact,
  spawnAgent,
  openInTempVscode,
  openInTempTerminal,
  getSupportedEditors,
  moveIssue,
  duplicateIssue,
  moveDoc,
  duplicateDoc,
  advancedSearch,
  getIssuesByUuid,
  getDocsBySlug,
}
