'use client'

import { listProjects, getProjectInfo, isInitialized } from './project'
import { getItem } from './getItem'
import { listItems } from './listItems'
import { listUsers, getUser } from './user'
import { listOrganizations, getOrganization } from './org'
import { getConfig, getDaemonInfo } from './config'
import { listLinks, getAvailableLinkTypes } from './link'
import { listAssets, listSharedAssets } from './asset'
import { getManifest, listItemTypes } from './stub'
import { getSupportedEditors } from './workspace'

export const readHandlers = {
  listProjects,
  getProjectInfo,
  isInitialized,
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
  listItemTypes,
  getSupportedEditors,
}
