import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrgDeleteConfirm } from './OrgDeleteConfirm'

describe('OrgDeleteConfirm', () => {
  it('renders delete confirmation message', () => {
    render(
      <OrgDeleteConfirm
        projects={[]}
        deleting={false}
        deleteError={null}
        handleDelete={vi.fn()}
        setShowDeleteConfirm={vi.fn()}
        setDeleteError={vi.fn()}
      />
    )
    expect(screen.getByText(/Are you sure/)).toBeDefined()
  })
})
