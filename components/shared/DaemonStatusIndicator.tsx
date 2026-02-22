'use client'

import Link from 'next/link'
import { route } from 'nextjs-routes'
import { useDaemonStatus } from '@/components/providers/DaemonStatusProvider'

export function DaemonStatusIndicator() {
  const { status } = useDaemonStatus()

  const statusConfig = {
    connected: {
      label: 'Daemon Online',
      className: 'connected',
    },
    disconnected: {
      label: 'Daemon Offline',
      className: 'disconnected',
    },
    checking: {
      label: 'Checking...',
      className: 'checking',
    },
    demo: {
      label: 'Demo Mode',
      className: 'demo',
    },
  }

  // eslint-disable-next-line security/detect-object-injection
  const config = statusConfig[status]

  return (
    <Link
      href={route({ pathname: '/daemon' })}
      className={`daemon-status-indicator ${config.className}`}
      title={config.label}
    >
      <span className="daemon-status-dot" />
      <span className="daemon-status-label">{config.label}</span>
    </Link>
  )
}
