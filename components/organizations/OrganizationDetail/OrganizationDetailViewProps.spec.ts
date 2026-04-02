import { describe, it } from 'vitest'
import type { OrganizationDetailViewProps } from './OrganizationDetailViewProps'

describe('OrganizationDetailViewProps', () => {
  it('is a valid type definition', () => {
    const _check: OrganizationDetailViewProps = {
      organization: {
        $typeName: 'centy.v1.Organization',
        name: 'Test',
        slug: 'test',
        description: '',
        createdAt: '',
        updatedAt: '',
        projectCount: 0,
      },
      projects: [],
      error: null,
      isEditing: false,
      editName: '',
      editDescription: '',
      editSlug: '',
      saving: false,
      deleting: false,
      showDeleteConfirm: false,
      deleteError: null,
      setIsEditing: () => undefined,
      setEditName: () => undefined,
      setEditDescription: () => undefined,
      setEditSlug: () => undefined,
      setShowDeleteConfirm: () => undefined,
      setDeleteError: () => undefined,
      handleSave: async () => undefined,
      handleDelete: async () => undefined,
      handleCancelEdit: () => undefined,
    }
    void _check
  })
})
