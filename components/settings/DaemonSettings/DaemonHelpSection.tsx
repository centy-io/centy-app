export function DaemonHelpSection() {
  return (
    <div className="daemon-help">
      <h4 className="daemon-help-title">Using the Online App with Local Daemon</h4>
      <p className="daemon-help-text">
        To use <code className="inline-code">app.centy.io</code> with a daemon running on your local
        machine, you need to:
      </p>
      <ol className="daemon-help-list">
        <li className="daemon-help-list-item">
          <strong className="daemon-help-strong">Start the daemon with CORS enabled:</strong>
          <pre className="daemon-help-pre">
            <code className="inline-code">centy-daemon --cors-origins=https://app.centy.io</code>
          </pre>
        </li>
        <li className="daemon-help-list-item">
          <strong className="daemon-help-strong">Set the daemon URL above to your local daemon address</strong>{' '}
          (default: <code className="inline-code">http://localhost:50051</code>)
        </li>
      </ol>

      <h4 className="daemon-help-title">Exposing Your Local Daemon</h4>
      <p className="daemon-help-text">
        If you want to access your daemon from outside your local network, you
        can use a tunneling service:
      </p>
      <ul className="daemon-help-list">
        <li className="daemon-help-list-item">
          <strong className="daemon-help-strong">ngrok:</strong>{' '}
          <code className="inline-code">ngrok http 50051 --host-header=localhost</code>
        </li>
        <li className="daemon-help-list-item">
          <strong className="daemon-help-strong">Cloudflare Tunnel:</strong>{' '}
          <code className="inline-code">cloudflared tunnel --url http://localhost:50051</code>
        </li>
      </ul>
      <p className="daemon-help-text">Then set the tunnel URL as your daemon URL above.</p>

      <h4 className="daemon-help-title">Security Considerations</h4>
      <ul className="daemon-help-list">
        <li className="daemon-help-list-item">
          Only expose your daemon to trusted origins using the{' '}
          <code className="inline-code">--cors-origins</code> flag
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
  )
}
