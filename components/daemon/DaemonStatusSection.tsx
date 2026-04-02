'use client'

import type { ReactElement } from 'react'
import type { DaemonStatus } from '@/components/providers/DaemonStatusProvider.types'

export function getStatusLabel(status: DaemonStatus): string {
  if (status === 'connected') return 'Connected'
  if (status === 'disconnected') return 'Disconnected'
  if (status === 'checking') return 'Checking...'
  return 'Demo Mode'
}

export interface DaemonStatusSectionProps {
  status: DaemonStatus
  lastChecked: Date | null
  checkNow: () => void
}

export function DaemonStatusSection({
  status,
  lastChecked,
  checkNow,
}: DaemonStatusSectionProps): ReactElement {
  return (
    <section className="settings-section">
      <h3 className="settings-section-title">Status</h3>
      <div className="settings-card">
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Connection</span>
            <span className={`info-value daemon-status-text ${status}`}>
              {getStatusLabel(status)}
            </span>
          </div>
          {lastChecked && (
            <div className="info-item">
              <span className="info-label">Last Checked</span>
              <span className="info-value">
                {lastChecked.toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
