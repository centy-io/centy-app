import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CreateIssueFormActions } from './CreateIssueFormActions'

describe('CreateIssueFormActions', () => {
  it('renders Cancel and Create Issue buttons', () => {
    render(
      <CreateIssueFormActions
        error={null}
        loading={false}
        title="Test"
        onCancel={vi.fn()}
      />
    )
    expect(screen.getByText('Cancel')).toBeDefined()
    expect(screen.getByText('Create Issue')).toBeDefined()
  })
})
