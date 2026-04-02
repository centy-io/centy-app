import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TitleScopeSelector } from './TitleScopeSelector'

describe('TitleScopeSelector', () => {
  it('renders scope buttons', () => {
    render(<TitleScopeSelector scope="user" onScopeChange={vi.fn()} />)
    expect(screen.getByText('User (local)')).toBeDefined()
    expect(screen.getByText('Project (shared)')).toBeDefined()
  })
})
