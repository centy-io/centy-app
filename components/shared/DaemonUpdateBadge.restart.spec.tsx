import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
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

function setupDaemonStatus() {
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
    latestDaemonVersion: '0.3.2',
  })
}

describe('DaemonUpdateBadge — clipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('copies install command to clipboard', async () => {
    setupDaemonStatus()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    fireEvent.click(screen.getAllByText('Copy')[0])

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledOnce()
    })
  })

  it('copies restart command to clipboard', async () => {
    setupDaemonStatus()
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.assign(navigator, { clipboard: { writeText } })

    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    fireEvent.click(screen.getAllByText('Copy')[1])

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith('centy daemon restart')
    })
  })
})

describe('DaemonUpdateBadge — restart notice', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows restart notice in dialog', () => {
    setupDaemonStatus()
    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    expect(
      screen.getByText(/restart the daemon for the changes to take effect/)
    ).toBeInTheDocument()
  })

  it('shows restart command in dialog', () => {
    setupDaemonStatus()
    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    expect(screen.getByText('centy daemon restart')).toBeInTheDocument()
  })

  it('shows restart daemon button in dialog', () => {
    setupDaemonStatus()
    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    expect(screen.getByText('Restart Daemon')).toBeInTheDocument()
  })
})
