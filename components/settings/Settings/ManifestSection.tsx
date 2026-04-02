import type { Manifest } from '@/gen/centy_pb'

interface ManifestSectionProps {
  manifest: Manifest | null
}

export function ManifestSection({ manifest }: ManifestSectionProps) {
  if (!manifest) return null

  return (
    <section className="settings-section">
      <h3 className="settings-section-title">Manifest</h3>
      <div className="settings-card">
        <div className="manifest-details">
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Schema Version</span>
              <span className="info-value">{manifest.schemaVersion}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Centy Version</span>
              <span className="info-value">{manifest.centyVersion}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Created</span>
              <span className="info-value">
                {manifest.createdAt
                  ? new Date(manifest.createdAt).toLocaleString()
                  : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
