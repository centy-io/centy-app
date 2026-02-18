'use client'

import Link from 'next/link'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { OrganizationDetailProps } from './OrganizationDetail.types'
import { useOrganizationDetail } from './useOrganizationDetail'
import { OrganizationDetailView } from './OrganizationDetailView'

export function OrganizationDetail({ orgSlug }: OrganizationDetailProps) {
  const state = useOrganizationDetail(orgSlug)

  useSaveShortcut({
    onSave: state.handleSave,
    enabled: state.isEditing && !state.saving && !!state.editName.trim(),
  })

  if (state.loading) {
    return (
      <div className="organization-detail">
        <div className="loading">Loading organization...</div>
      </div>
    )
  }

  if (state.error && !state.organization) {
    return (
      <div className="organization-detail">
        <DaemonErrorMessage error={state.error} />
        <Link href="/organizations" className="back-link">
          Back to Organizations
        </Link>
      </div>
    )
  }

  if (!state.organization) {
    return (
      <div className="organization-detail">
        <div className="error-message">Organization not found</div>
        <Link href="/organizations" className="back-link">
          Back to Organizations
        </Link>
      </div>
    )
  }

  return (
    <OrganizationDetailView
      organization={state.organization}
      projects={state.projects}
      error={state.error}
      isEditing={state.isEditing}
      editName={state.editName}
      editDescription={state.editDescription}
      editSlug={state.editSlug}
      saving={state.saving}
      deleting={state.deleting}
      showDeleteConfirm={state.showDeleteConfirm}
      deleteError={state.deleteError}
      setIsEditing={state.setIsEditing}
      setEditName={state.setEditName}
      setEditDescription={state.setEditDescription}
      setEditSlug={state.setEditSlug}
      setShowDeleteConfirm={state.setShowDeleteConfirm}
      setDeleteError={state.setDeleteError}
      handleSave={state.handleSave}
      handleDelete={state.handleDelete}
      handleCancelEdit={state.handleCancelEdit}
    />
  )
}
