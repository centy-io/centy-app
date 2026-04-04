'use client'

import { updateConfig, createUser, updateUser, deleteUser } from './write'
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
  updateLink,
  addAsset,
  deleteAsset,
  getAsset,
} from './org-write'

export const writeHandlers = {
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
  updateLink,
  addAsset,
  deleteAsset,
  getAsset,
}
