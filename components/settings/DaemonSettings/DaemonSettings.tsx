'use client'

import { useState, useMemo } from 'react'
import { DaemonHelpSection } from './DaemonHelpSection'
import {
  getCurrentDaemonUrl,
  setDaemonUrl,
  resetDaemonUrl,
  isUsingDefaultDaemonUrl,
  DEFAULT_DAEMON_URL,
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
        <label className="form-label" htmlFor="daemon-url">
          Daemon URL
        </label>
        <div className="input-with-button">
          <input
            className="form-input"
            id="daemon-url"
            type="text"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={DEFAULT_DAEMON_URL}
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

      {showHelp && <DaemonHelpSection />}
    </div>
  )
}
