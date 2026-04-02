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

describe('DaemonUpdateBadge — restart action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calls restart API and shows success message', async () => {
    setupDaemonStatus()
    const { centyClient } = await import('@/lib/grpc/client')
    vi.mocked(centyClient.restart).mockResolvedValue({
      success: true,
      message: 'Daemon is restarting...',
      $typeName: 'centy.RestartResponse',
    })

    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    fireEvent.click(screen.getByText('Restart Daemon'))

    await waitFor(() => {
      expect(screen.getByText('Daemon is restarting...')).toBeInTheDocument()
    })
  })

  it('shows fallback error message when restart rejects', async () => {
    setupDaemonStatus()
    const { centyClient } = await import('@/lib/grpc/client')
    vi.mocked(centyClient.restart).mockRejectedValue({ code: 'UNAVAILABLE' })

    render(<DaemonUpdateBadge />)
    fireEvent.click(screen.getByText('Update available'))
    fireEvent.click(screen.getByText('Restart Daemon'))

    await waitFor(() => {
      expect(
        screen.getByText('Failed to connect to daemon')
      ).toBeInTheDocument()
    })
  })
})
