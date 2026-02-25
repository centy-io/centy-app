'use client'

const { NEXT_PUBLIC_COMMIT_SHA } = process.env

export function GeneralSettings() {
  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2 className="settings-title">General Settings</h2>
      </div>

      {NEXT_PUBLIC_COMMIT_SHA && (
        <section className="settings-section">
          <h3 className="settings-section-title">App Information</h3>
          <div className="settings-card">
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Commit SHA</span>
                <span className="info-value commit-sha">
                  {NEXT_PUBLIC_COMMIT_SHA.slice(0, 7)}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
