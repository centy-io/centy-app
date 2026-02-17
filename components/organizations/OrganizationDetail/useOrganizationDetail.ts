'use client'

import { useState, useCallback, useEffect } from 'react'
import type { Organization, ProjectInfo } from '@/gen/centy_pb'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { fetchOrganizationData, handleFetchError } from './orgDetailActions'
import { useOrgSave, useOrgDelete } from './useOrgSave'

export function useOrganizationDetail(orgSlug: string) {
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [projects, setProjects] = useState<ProjectInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const fetchOrganization = useCallback(async () => {
    if (!orgSlug) {
      setError('Missing organization slug')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const result = await fetchOrganizationData(orgSlug)
      setOrganization(result.organization)
      setEditName(result.organization.name)
      setEditDescription(result.organization.description || '')
      setEditSlug(result.organization.slug)
      setProjects(result.projects)
    } catch (err) {
      setError(handleFetchError(err))
    } finally {
      setLoading(false)
    }
  }, [orgSlug])

  useEffect(() => {
    fetchOrganization()
  }, [fetchOrganization])

  const handleSave = useOrgSave(
    orgSlug,
    editName,
    editDescription,
    editSlug,
    setOrganization,
    setIsEditing,
    setError,
    setSaving
  )

  const handleDelete = useOrgDelete(orgSlug, setDeleting, setDeleteError)

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (organization) {
      setEditName(organization.name)
      setEditDescription(organization.description || '')
      setEditSlug(organization.slug)
    }
  }

  useSaveShortcut({
    onSave: handleSave,
    enabled: isEditing && !saving && !!editName.trim(),
  })

  return {
    organization,
    projects,
    loading,
    error,
    isEditing,
    setIsEditing,
    editName,
    setEditName,
    editDescription,
    setEditDescription,
    editSlug,
    setEditSlug,
    saving,
    deleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteError,
    setDeleteError,
    handleSave,
    handleDelete,
    handleCancelEdit,
  }
}
