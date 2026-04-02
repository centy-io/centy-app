import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { DaemonUpdateBadge } from './DaemonUpdateBadge'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'

vi.mock('@/components/providers/DaemonStatusProvider', () => ({
  useDaemonStatus: vi.fn(),
}))

vi.mock('@/lib/grpc/client', () => ({
  centyClient: {
    restart: vi.fn(),
  },
}))

vi.mock('@/gen/centy_pb', () => ({
  RestartRequestSchema: {},
}))

vi.mock('@bufbuild/protobuf', () => ({
  create: vi.fn(() => ({})),
}))

const mockUseDaemonStatus = vi.mocked(useDaemonStatus)

function setupDaemonStatus(daemonUpdateAvailable: boolean) {
  mockUseDaemonStatus.mockReturnValue({
    status: 'connected',
    lastChecked: null,
    checkNow: vi.fn(),
    enterDemoMode: vi.fn(),
    exitDemoMode: vi.fn(),
    demoProjectPath: '',
    vscodeAvailable: null,
    editors: [],
    daemonVersion: '0.3.1',
    daemonUpdateAvailable,
  })
}

describe('DaemonUpdateBadge', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the update badge when an update is available', () => {
    setupDaemonStatus(true)
    render(<DaemonUpdateBadge />)
    expect(screen.getByText('Update available')).toBeInTheDocument()
  })

  it('does not render when no update is available', () => {
    setupDaemonStatus(false)
    const { container } = render(<DaemonUpdateBadge />)
    expect(container.firstChild).toBeNull()
  })

  it('opens dialog when badge is clicked', () => {
    setupDaemonStatus(true)
    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    expect(screen.getByText('Daemon update available')).toBeInTheDocument()
  })

  it('closes dialog when close button is clicked', () => {
    setupDaemonStatus(true)
    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    fireEvent.click(screen.getByLabelText('Close'))
    expect(
      screen.queryByText('Daemon update available')
    ).not.toBeInTheDocument()
  })

  it('shows install command in dialog', () => {
    setupDaemonStatus(true)
    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    expect(screen.getByText(/curl -fsSL/)).toBeInTheDocument()
  })
})
