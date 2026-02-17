'use client'

import Link from 'next/link'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'
import type { OrganizationDetailProps } from './OrganizationDetail.types'
import { useOrganizationDetail } from './useOrganizationDetail'
import { OrganizationDetailView } from './OrganizationDetailView'

export function OrganizationDetail({ orgSlug }: OrganizationDetailProps) {
  const hook = useOrganizationDetail(orgSlug)

  if (hook.loading) {
    return (
      <div className="organization-detail">
        <div className="loading">Loading organization...</div>
      </div>
    )
  }
  if (hook.error && !hook.organization) {
    return (
      <div className="organization-detail">
        <DaemonErrorMessage error={hook.error} />
        <Link href="/organizations" className="back-link">
          Back to Organizations
        </Link>
      </div>
    )
  }
  if (!hook.organization) {
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
      organization={hook.organization}
      projects={hook.projects}
      error={hook.error}
      isEditing={hook.isEditing}
      setIsEditing={hook.setIsEditing}
      editName={hook.editName}
      setEditName={hook.setEditName}
      editDescription={hook.editDescription}
      setEditDescription={hook.setEditDescription}
      editSlug={hook.editSlug}
      setEditSlug={hook.setEditSlug}
      saving={hook.saving}
      deleting={hook.deleting}
      showDeleteConfirm={hook.showDeleteConfirm}
      setShowDeleteConfirm={hook.setShowDeleteConfirm}
      deleteError={hook.deleteError}
      setDeleteError={hook.setDeleteError}
      handleSave={hook.handleSave}
      handleDelete={hook.handleDelete}
      handleCancelEdit={hook.handleCancelEdit}
    />
  )
}
