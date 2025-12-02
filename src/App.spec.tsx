import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import App from './App'

// Mock the centyClient
vi.mock('./api/client.ts', () => ({
  centyClient: {
    init: vi.fn(),
    getReconciliationPlan: vi.fn(),
    executeReconciliation: vi.fn(),
  },
}))

describe('App', () => {
  it('should render the header', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Centy')
  })

  it('should render the tagline', () => {
    render(<App />)
    expect(
      screen.getByText('Local-first issue and documentation tracker')
    ).toBeInTheDocument()
  })

  it('should render the InitProject component', () => {
    render(<App />)
    expect(screen.getByText('Initialize Centy Project')).toBeInTheDocument()
  })
})
