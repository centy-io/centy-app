import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrgActionsBar } from './OrgActionsBar'

describe('OrgActionsBar', () => {
  it('renders Edit and Delete buttons when not editing', () => {
    render(
      <OrgActionsBar
        isEditing={false}
        saving={false}
        editName="Test"
        setIsEditing={vi.fn()}
        setShowDeleteConfirm={vi.fn()}
        handleSave={vi.fn()}
        handleCancelEdit={vi.fn()}
      />
    )
    expect(screen.getByText('Edit')).toBeDefined()
    expect(screen.getByText('Delete')).toBeDefined()
  })
})
