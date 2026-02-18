'use client'

import type { GitContributor } from '@/gen/centy_pb'

interface SyncPreviewProps {
  wouldCreate: GitContributor[]
  wouldSkip: GitContributor[]
}

export function SyncPreview({ wouldCreate, wouldSkip }: SyncPreviewProps) {
  if (wouldCreate.length === 0 && wouldSkip.length === 0) {
    return (
      <div className="sync-empty">
        <p>No git contributors found in this repository.</p>
      </div>
    )
  }

  if (wouldCreate.length === 0) {
    return (
      <div className="sync-up-to-date">
        <p>All git contributors are already in the users list.</p>
      </div>
    )
  }

  return (
    <>
      <div className="sync-section">
        <h4>Will Create ({wouldCreate.length})</h4>
        <ul className="contributor-list">
          {wouldCreate.map((contributor, i) => (
            <li key={i} className="contributor-item create">
              <span className="contributor-name">{contributor.name}</span>
              <span className="contributor-email">{contributor.email}</span>
            </li>
          ))}
        </ul>
      </div>
      {wouldSkip.length > 0 && (
        <div className="sync-section">
          <h4>Will Skip ({wouldSkip.length})</h4>
          <ul className="contributor-list">
            {wouldSkip.map((contributor, i) => (
              <li key={i} className="contributor-item skip">
                <span className="contributor-name">{contributor.name}</span>
                <span className="contributor-email">{contributor.email}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}
