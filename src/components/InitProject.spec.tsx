import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { InitProject } from './InitProject'

// Mock the centyClient
vi.mock('../api/client.ts', () => ({
  centyClient: {
    init: vi.fn(),
    getReconciliationPlan: vi.fn(),
    executeReconciliation: vi.fn(),
  },
}))

import { centyClient } from '../api/client.ts'

describe('InitProject', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render the initial form', () => {
    render(<InitProject />)

    expect(screen.getByText('Initialize Centy Project')).toBeInTheDocument()
    expect(screen.getByLabelText('Project Path:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Quick Init' })).toBeDisabled()
    expect(
      screen.getByRole('button', { name: 'Review Changes' })
    ).toBeDisabled()
  })

  it('should enable buttons when path is entered', () => {
    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    expect(screen.getByRole('button', { name: 'Quick Init' })).toBeEnabled()
    expect(screen.getByRole('button', { name: 'Review Changes' })).toBeEnabled()
  })

  it('should call init with force=true on Quick Init', async () => {
    const mockInit = vi.mocked(centyClient.init)
    mockInit.mockResolvedValue({
      success: true,
      error: '',
      created: ['issues/', 'docs/'],
      restored: [],
      reset: [],
      skipped: [],
      manifest: undefined,
      $typeName: 'centy.InitResponse',
      $unknown: undefined,
    })

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const quickInitBtn = screen.getByRole('button', { name: 'Quick Init' })
    fireEvent.click(quickInitBtn)

    await waitFor(() => {
      expect(mockInit).toHaveBeenCalledWith(
        expect.objectContaining({
          projectPath: '/test/path',
          force: true,
        })
      )
    })

    expect(screen.getByText('Success!')).toBeInTheDocument()
  })

  it('should show error on init failure', async () => {
    const mockInit = vi.mocked(centyClient.init)
    mockInit.mockResolvedValue({
      success: false,
      error: 'Permission denied',
      created: [],
      restored: [],
      reset: [],
      skipped: [],
      manifest: undefined,
      $typeName: 'centy.InitResponse',
      $unknown: undefined,
    })

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const quickInitBtn = screen.getByRole('button', { name: 'Quick Init' })
    fireEvent.click(quickInitBtn)

    await waitFor(() => {
      expect(screen.getByText('Permission denied')).toBeInTheDocument()
    })
  })

  it('should show reconciliation plan on Review Changes', async () => {
    const mockGetPlan = vi.mocked(centyClient.getReconciliationPlan)
    mockGetPlan.mockResolvedValue({
      toCreate: [
        {
          path: 'issues/',
          fileType: 2,
          hash: '',
          contentPreview: '',
          $typeName: 'centy.FileInfo',
          $unknown: undefined,
        },
      ],
      toRestore: [],
      toReset: [],
      upToDate: [],
      userFiles: [],
      needsDecisions: false,
      $typeName: 'centy.ReconciliationPlan',
      $unknown: undefined,
    })

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const reviewBtn = screen.getByRole('button', { name: 'Review Changes' })
    fireEvent.click(reviewBtn)

    await waitFor(() => {
      expect(screen.getByText('Reconciliation Plan')).toBeInTheDocument()
      expect(screen.getByText('Files to Create')).toBeInTheDocument()
    })
  })

  it('should handle network errors gracefully', async () => {
    const mockInit = vi.mocked(centyClient.init)
    mockInit.mockRejectedValue(new Error('Connection refused'))

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const quickInitBtn = screen.getByRole('button', { name: 'Quick Init' })
    fireEvent.click(quickInitBtn)

    await waitFor(() => {
      expect(screen.getByText('Connection refused')).toBeInTheDocument()
    })
  })

  it('should allow trying again after error', async () => {
    const mockInit = vi.mocked(centyClient.init)
    mockInit.mockRejectedValueOnce(new Error('Connection refused'))

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const quickInitBtn = screen.getByRole('button', { name: 'Quick Init' })
    fireEvent.click(quickInitBtn)

    await waitFor(() => {
      expect(screen.getByText('Connection refused')).toBeInTheDocument()
    })

    const tryAgainBtn = screen.getByRole('button', { name: 'Try Again' })
    fireEvent.click(tryAgainBtn)

    expect(screen.getByLabelText('Project Path:')).toBeInTheDocument()
  })

  it('should execute plan with selected files to restore and reset', async () => {
    const mockGetPlan = vi.mocked(centyClient.getReconciliationPlan)
    const mockExecute = vi.mocked(centyClient.executeReconciliation)

    mockGetPlan.mockResolvedValue({
      toCreate: [],
      toRestore: [
        {
          path: 'docs/',
          fileType: 2,
          hash: '',
          contentPreview: '',
          $typeName: 'centy.FileInfo',
          $unknown: undefined,
        },
      ],
      toReset: [
        {
          path: 'README.md',
          fileType: 1,
          hash: '',
          contentPreview: '',
          $typeName: 'centy.FileInfo',
          $unknown: undefined,
        },
      ],
      upToDate: [],
      userFiles: [],
      needsDecisions: true,
      $typeName: 'centy.ReconciliationPlan',
      $unknown: undefined,
    })

    mockExecute.mockResolvedValue({
      success: true,
      error: '',
      created: [],
      restored: ['docs/'],
      reset: ['README.md'],
      skipped: [],
      manifest: undefined,
      $typeName: 'centy.InitResponse',
      $unknown: undefined,
    })

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const reviewBtn = screen.getByRole('button', { name: 'Review Changes' })
    fireEvent.click(reviewBtn)

    await waitFor(() => {
      expect(screen.getByText('Files to Restore')).toBeInTheDocument()
      expect(screen.getByText('Files to Reset')).toBeInTheDocument()
    })

    // Toggle checkbox for reset file
    const resetCheckbox = screen.getByRole('checkbox', { name: /README.md/i })
    fireEvent.click(resetCheckbox)

    const applyBtn = screen.getByRole('button', { name: 'Apply Changes' })
    fireEvent.click(applyBtn)

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument()
      expect(screen.getByText('Restored:')).toBeInTheDocument()
      expect(screen.getByText('Reset:')).toBeInTheDocument()
    })
  })

  it('should handle execute reconciliation failure', async () => {
    const mockGetPlan = vi.mocked(centyClient.getReconciliationPlan)
    const mockExecute = vi.mocked(centyClient.executeReconciliation)

    mockGetPlan.mockResolvedValue({
      toCreate: [
        {
          path: 'issues/',
          fileType: 2,
          hash: '',
          contentPreview: '',
          $typeName: 'centy.FileInfo',
          $unknown: undefined,
        },
      ],
      toRestore: [],
      toReset: [],
      upToDate: [],
      userFiles: [],
      needsDecisions: false,
      $typeName: 'centy.ReconciliationPlan',
      $unknown: undefined,
    })

    mockExecute.mockResolvedValue({
      success: false,
      error: 'Disk full',
      created: [],
      restored: [],
      reset: [],
      skipped: [],
      manifest: undefined,
      $typeName: 'centy.InitResponse',
      $unknown: undefined,
    })

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const reviewBtn = screen.getByRole('button', { name: 'Review Changes' })
    fireEvent.click(reviewBtn)

    await waitFor(() => {
      expect(screen.getByText('Reconciliation Plan')).toBeInTheDocument()
    })

    const applyBtn = screen.getByRole('button', { name: 'Apply Changes' })
    fireEvent.click(applyBtn)

    await waitFor(() => {
      expect(screen.getByText('Disk full')).toBeInTheDocument()
    })
  })

  it('should cancel plan and go back to input', async () => {
    const mockGetPlan = vi.mocked(centyClient.getReconciliationPlan)
    mockGetPlan.mockResolvedValue({
      toCreate: [
        {
          path: 'issues/',
          fileType: 2,
          hash: '',
          contentPreview: '',
          $typeName: 'centy.FileInfo',
          $unknown: undefined,
        },
      ],
      toRestore: [],
      toReset: [],
      upToDate: [],
      userFiles: [],
      needsDecisions: false,
      $typeName: 'centy.ReconciliationPlan',
      $unknown: undefined,
    })

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const reviewBtn = screen.getByRole('button', { name: 'Review Changes' })
    fireEvent.click(reviewBtn)

    await waitFor(() => {
      expect(screen.getByText('Reconciliation Plan')).toBeInTheDocument()
    })

    const cancelBtn = screen.getByRole('button', { name: 'Cancel' })
    fireEvent.click(cancelBtn)

    expect(screen.getByLabelText('Project Path:')).toBeInTheDocument()
  })

  it('should show up to date and user files sections', async () => {
    const mockGetPlan = vi.mocked(centyClient.getReconciliationPlan)
    mockGetPlan.mockResolvedValue({
      toCreate: [],
      toRestore: [],
      toReset: [],
      upToDate: [
        {
          path: 'issues/',
          fileType: 2,
          hash: 'abc123',
          contentPreview: '',
          $typeName: 'centy.FileInfo',
          $unknown: undefined,
        },
      ],
      userFiles: [
        {
          path: 'custom.md',
          fileType: 1,
          hash: 'def456',
          contentPreview: '',
          $typeName: 'centy.FileInfo',
          $unknown: undefined,
        },
      ],
      needsDecisions: false,
      $typeName: 'centy.ReconciliationPlan',
      $unknown: undefined,
    })

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const reviewBtn = screen.getByRole('button', { name: 'Review Changes' })
    fireEvent.click(reviewBtn)

    await waitFor(() => {
      expect(screen.getByText('Up to Date')).toBeInTheDocument()
      expect(screen.getByText('User Files (unchanged)')).toBeInTheDocument()
    })
  })

  it('should allow initializing another project after success', async () => {
    const mockInit = vi.mocked(centyClient.init)
    mockInit.mockResolvedValue({
      success: true,
      error: '',
      created: ['issues/'],
      restored: [],
      reset: [],
      skipped: [],
      manifest: undefined,
      $typeName: 'centy.InitResponse',
      $unknown: undefined,
    })

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const quickInitBtn = screen.getByRole('button', { name: 'Quick Init' })
    fireEvent.click(quickInitBtn)

    await waitFor(() => {
      expect(screen.getByText('Success!')).toBeInTheDocument()
    })

    const initAnotherBtn = screen.getByRole('button', {
      name: 'Initialize Another Project',
    })
    fireEvent.click(initAnotherBtn)

    expect(screen.getByLabelText('Project Path:')).toBeInTheDocument()
  })

  it('should handle getReconciliationPlan network error', async () => {
    const mockGetPlan = vi.mocked(centyClient.getReconciliationPlan)
    mockGetPlan.mockRejectedValue(new Error('Network error'))

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const reviewBtn = screen.getByRole('button', { name: 'Review Changes' })
    fireEvent.click(reviewBtn)

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument()
    })
  })

  it('should handle executeReconciliation network error', async () => {
    const mockGetPlan = vi.mocked(centyClient.getReconciliationPlan)
    const mockExecute = vi.mocked(centyClient.executeReconciliation)

    mockGetPlan.mockResolvedValue({
      toCreate: [
        {
          path: 'issues/',
          fileType: 2,
          hash: '',
          contentPreview: '',
          $typeName: 'centy.FileInfo',
          $unknown: undefined,
        },
      ],
      toRestore: [],
      toReset: [],
      upToDate: [],
      userFiles: [],
      needsDecisions: false,
      $typeName: 'centy.ReconciliationPlan',
      $unknown: undefined,
    })

    mockExecute.mockRejectedValue(new Error('Connection lost'))

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const reviewBtn = screen.getByRole('button', { name: 'Review Changes' })
    fireEvent.click(reviewBtn)

    await waitFor(() => {
      expect(screen.getByText('Reconciliation Plan')).toBeInTheDocument()
    })

    const applyBtn = screen.getByRole('button', { name: 'Apply Changes' })
    fireEvent.click(applyBtn)

    await waitFor(() => {
      expect(screen.getByText('Connection lost')).toBeInTheDocument()
    })
  })

  it('should toggle restore checkbox off', async () => {
    const mockGetPlan = vi.mocked(centyClient.getReconciliationPlan)
    mockGetPlan.mockResolvedValue({
      toCreate: [],
      toRestore: [
        {
          path: 'docs/',
          fileType: 2,
          hash: '',
          contentPreview: '',
          $typeName: 'centy.FileInfo',
          $unknown: undefined,
        },
      ],
      toReset: [],
      upToDate: [],
      userFiles: [],
      needsDecisions: true,
      $typeName: 'centy.ReconciliationPlan',
      $unknown: undefined,
    })

    render(<InitProject />)

    const input = screen.getByLabelText('Project Path:')
    fireEvent.change(input, { target: { value: '/test/path' } })

    const reviewBtn = screen.getByRole('button', { name: 'Review Changes' })
    fireEvent.click(reviewBtn)

    await waitFor(() => {
      expect(screen.getByText('Files to Restore')).toBeInTheDocument()
    })

    // Checkbox is pre-selected for restore, click to uncheck
    const restoreCheckbox = screen.getByRole('checkbox', { name: /docs\//i })
    expect(restoreCheckbox).toBeChecked()

    fireEvent.click(restoreCheckbox)
    expect(restoreCheckbox).not.toBeChecked()

    // Click again to re-check
    fireEvent.click(restoreCheckbox)
    expect(restoreCheckbox).toBeChecked()
  })
})
