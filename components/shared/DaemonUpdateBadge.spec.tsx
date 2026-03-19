import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { DaemonUpdateBadge } from './DaemonUpdateBadge'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'

vi.mock('@/components/providers/DaemonStatusProvider', () => ({
  useDaemonStatus: vi.fn(),
}))

const mockUseDaemonStatus = vi.mocked(useDaemonStatus)

function setupDaemonStatus(
  daemonVersion: string | null,
  latestDaemonVersion: string | null
) {
  mockUseDaemonStatus.mockReturnValue({
    status: 'connected',
    lastChecked: null,
    checkNow: vi.fn(),
    enterDemoMode: vi.fn(),
    exitDemoMode: vi.fn(),
    demoProjectPath: '',
    vscodeAvailable: null,
    editors: [],
    daemonVersion,
    latestDaemonVersion,
  })
}

describe('DaemonUpdateBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the update badge when a newer version is available', () => {
    setupDaemonStatus('0.3.1', '0.3.2')
    render(<DaemonUpdateBadge />)
    expect(screen.getByText('Update available')).toBeInTheDocument()
  })

  it('does not render when daemon is on latest version', () => {
    setupDaemonStatus('0.3.2', '0.3.2')
    const { container } = render(<DaemonUpdateBadge />)
    expect(container.firstChild).toBeNull()
  })

  it('does not render when daemonVersion is null', () => {
    setupDaemonStatus(null, '0.3.2')
    const { container } = render(<DaemonUpdateBadge />)
    expect(container.firstChild).toBeNull()
  })

  it('does not render when latestDaemonVersion is null', () => {
    setupDaemonStatus('0.3.1', null)
    const { container } = render(<DaemonUpdateBadge />)
    expect(container.firstChild).toBeNull()
  })

  it('opens dialog when badge is clicked', () => {
    setupDaemonStatus('0.3.1', '0.3.2')
    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    expect(screen.getByText('Daemon update available')).toBeInTheDocument()
  })

  it('closes dialog when close button is clicked', () => {
    setupDaemonStatus('0.3.1', '0.3.2')
    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    fireEvent.click(screen.getByLabelText('Close'))
    expect(
      screen.queryByText('Daemon update available')
    ).not.toBeInTheDocument()
  })

  it('shows install command in dialog', () => {
    setupDaemonStatus('0.3.1', '0.3.2')
    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    expect(screen.getByText(/curl -fsSL/)).toBeInTheDocument()
  })

  it('copies install command to clipboard', async () => {
    setupDaemonStatus('0.3.1', '0.3.2')
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    fireEvent.click(screen.getByText('Copy'))

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledOnce()
    })
  })
})
