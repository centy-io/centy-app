'use client'

import { listProjects, getProjectInfo, isInitialized } from './project'
import { listIssues, getIssue, getIssueByDisplayNumber } from './issue'
import { getItem } from './getItem'
import { listItems } from './listItems'
import { listUsers, getUser } from './user'
import { listOrganizations, getOrganization } from './org'
import { getConfig, getDaemonInfo } from './config'
import { listLinks, getAvailableLinkTypes } from './link'
import { listAssets, listSharedAssets } from './asset'
import {
  getManifest,
  getNextIssueNumber,
  getProjectVersion,
  getFeatureStatus,
  listUncompactedIssues,
  getInstruction,
  getCompact,
  spawnWorkspace,
  listItemTypes,
} from './stub'
import { getSupportedEditors } from './workspace'
import { advancedSearch, getIssuesByUuid, getDocsBySlug } from './entity-ops'

export const readHandlers = {
  listProjects,
  getProjectInfo,
  isInitialized,
  listIssues,
  getIssue,
  getIssueByDisplayNumber,
  getItem,
  listItems,
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
  getManifest,
  getNextIssueNumber,
  getProjectVersion,
  getFeatureStatus,
  listUncompactedIssues,
  getInstruction,
  getCompact,
  spawnWorkspace,
  listItemTypes,
  getSupportedEditors,
  advancedSearch,
  getIssuesByUuid,
  getDocsBySlug,
}
