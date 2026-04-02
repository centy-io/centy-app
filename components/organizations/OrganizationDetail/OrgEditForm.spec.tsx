import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { OrgEditForm } from './OrgEditForm'

describe('OrgEditForm', () => {
  it('renders edit form fields', () => {
    render(
      <OrgEditForm
        editName="Test Org"
        editDescription=""
        editSlug="test-org"
        currentSlug="test-org"
        setEditName={vi.fn()}
        setEditDescription={vi.fn()}
        setEditSlug={vi.fn()}
      />
    )
    expect(screen.getByLabelText('Name:')).toBeDefined()
    expect(screen.getByLabelText('Slug:')).toBeDefined()
  })
})
