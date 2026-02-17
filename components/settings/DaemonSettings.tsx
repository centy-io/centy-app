'use client'

import { useState, useMemo } from 'react'
import {
  getCurrentDaemonUrl,
  setDaemonUrl,
  resetDaemonUrl,
  isUsingDefaultDaemonUrl,
} from '@/lib/grpc/client'

export function DaemonSettings() {
  const initialUrl = useMemo(() => getCurrentDaemonUrl(), [])
  const initialIsDefault = useMemo(() => isUsingDefaultDaemonUrl(), [])

  const [url, setUrl] = useState(initialUrl)
  const [isDefault] = useState(initialIsDefault)
  const [showHelp, setShowHelp] = useState(false)

  const handleSave = () => {
    if (url.trim()) {
      setDaemonUrl(url.trim())
    }
  }

  const handleReset = () => {
    resetDaemonUrl()
  }

  const isModified = url !== getCurrentDaemonUrl()

  return (
    <div className="daemon-settings">
      <p className="settings-description">
        Configure the URL of your Centy daemon. This allows the web app to
        connect to a daemon running on your local machine or a remote server.
      </p>

      <div className="daemon-url-input">
        <label htmlFor="daemon-url" className="daemon-url-label">
          Daemon URL
        </label>
        <div className="input-with-button">
          <input
            id="daemon-url"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="http://localhost:50051"
            className="daemon-url-text-input"
          />
          <button
            onClick={handleSave}
            disabled={!isModified || !url.trim()}
            className="save-btn"
          >
            Save
          </button>
          {!isDefault && (
            <button onClick={handleReset} className="reset-btn">
              Reset to Default
            </button>
          )}
        </div>
        {!isDefault && (
          <span className="custom-url-badge">Using custom URL</span>
        )}
      </div>

      <button
        className="help-toggle"
        onClick={() => setShowHelp(!showHelp)}
        type="button"
      >
        {showHelp ? 'Hide' : 'Show'} setup instructions
      </button>

      {showHelp && (
        <div className="daemon-help">
          <h4 className="daemon-help-heading">
            Using the Online App with Local Daemon
          </h4>
          <p className="daemon-help-text">
            To use <code className="daemon-help-code">app.centy.io</code> with a
            daemon running on your local machine, you need to:
          </p>
          <ol className="daemon-help-list">
            <li className="daemon-help-list-item">
              <strong className="daemon-help-strong">
                Start the daemon with CORS enabled:
              </strong>
              <pre className="daemon-help-pre">
                <code className="daemon-help-code">
                  centy-daemon --cors-origins=https://app.centy.io
                </code>
              </pre>
            </li>
            <li className="daemon-help-list-item">
              <strong className="daemon-help-strong">
                Set the daemon URL above to your local daemon address
              </strong>{' '}
              (default:{' '}
              <code className="daemon-help-code">http://localhost:50051</code>)
            </li>
          </ol>

          <h4 className="daemon-help-heading">Exposing Your Local Daemon</h4>
          <p className="daemon-help-text">
            If you want to access your daemon from outside your local network,
            you can use a tunneling service:
          </p>
          <ul className="daemon-help-list">
            <li className="daemon-help-list-item">
              <strong className="daemon-help-strong">ngrok:</strong>{' '}
              <code className="daemon-help-code">
                ngrok http 50051 --host-header=localhost
              </code>
            </li>
            <li className="daemon-help-list-item">
              <strong className="daemon-help-strong">Cloudflare Tunnel:</strong>{' '}
              <code className="daemon-help-code">
                cloudflared tunnel --url http://localhost:50051
              </code>
            </li>
          </ul>
          <p className="daemon-help-text">
            Then set the tunnel URL as your daemon URL above.
          </p>

          <h4 className="daemon-help-heading">Security Considerations</h4>
          <ul className="daemon-help-list">
            <li className="daemon-help-list-item">
              Only expose your daemon to trusted origins using the{' '}
              <code className="daemon-help-code">--cors-origins</code> flag
            </li>
            <li className="daemon-help-list-item">
              Consider using HTTPS when exposing your daemon over the internet
            </li>
            <li className="daemon-help-list-item">
              The daemon stores project data locally - be careful about who has
              access
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}
