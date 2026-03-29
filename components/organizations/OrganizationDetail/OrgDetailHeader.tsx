'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { OrgActionsBar } from './OrgActionsBar'
import type { OrganizationDetailViewProps } from './OrganizationDetailViewProps'

interface OrgDetailHeaderProps {
  isEditing: boolean
  saving: boolean
  editName: string
  setIsEditing: OrganizationDetailViewProps['setIsEditing']
  setShowDeleteConfirm: OrganizationDetailViewProps['setShowDeleteConfirm']
  handleSave: OrganizationDetailViewProps['handleSave']
  handleCancelEdit: OrganizationDetailViewProps['handleCancelEdit']
}

export function OrgDetailHeader({
  isEditing,
  saving,
  editName,
  setIsEditing,
  setShowDeleteConfirm,
  handleSave,
  handleCancelEdit,
}: OrgDetailHeaderProps): React.JSX.Element {
  return (
    <div className="organization-header">
      <Link href={route({ pathname: '/organizations' })} className="back-link">
        Back to Organizations
      </Link>
      <div className="organization-actions">
        <OrgActionsBar
          isEditing={isEditing}
          saving={saving}
          editName={editName}
          setIsEditing={setIsEditing}
          setShowDeleteConfirm={setShowDeleteConfirm}
          handleSave={handleSave}
          handleCancelEdit={handleCancelEdit}
        />
      </div>
    </div>
  )
}
