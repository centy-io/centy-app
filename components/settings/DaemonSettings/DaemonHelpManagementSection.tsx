export function DaemonHelpManagementSection() {
  return (
    <>
      <h4 className="daemon-help-title">Autostart on Boot</h4>
      <p className="daemon-help-text">
        To have the daemon start automatically when your machine boots:
      </p>
      <pre className="daemon-help-pre">
        <code className="inline-code">centy daemon autostart --enable</code>
      </pre>
      <p className="daemon-help-text">
        Add <code className="inline-code">CENTY_CORS_ORIGINS</code> to your
        shell profile (e.g. <code className="inline-code">~/.zshrc</code> or{' '}
        <code className="inline-code">~/.bashrc</code>) so that CORS is
        configured on every startup:
      </p>
      <pre className="daemon-help-pre">
        <code className="inline-code">
          export CENTY_CORS_ORIGINS=https://app.centy.io
        </code>
      </pre>

      <h4 className="daemon-help-title">Exposing Your Local Daemon</h4>
      <p className="daemon-help-text">
        If you want to access your daemon from outside your local network, you
        can use a tunneling service:
      </p>
      <ul className="daemon-help-list">
        <li className="daemon-help-list-item">
          <strong className="daemon-help-strong">ngrok:</strong>{' '}
          <code className="inline-code">
            ngrok http 50051 --host-header=localhost
          </code>
        </li>
        <li className="daemon-help-list-item">
          <strong className="daemon-help-strong">Cloudflare Tunnel:</strong>{' '}
          <code className="inline-code">
            cloudflared tunnel --url http://localhost:50051
          </code>
        </li>
      </ul>
      <p className="daemon-help-text">
        Then set the tunnel URL as your daemon URL above.
      </p>

      <h4 className="daemon-help-title">Security Considerations</h4>
      <ul className="daemon-help-list">
        <li className="daemon-help-list-item">
          Only expose your daemon to trusted origins using the{' '}
          <code className="inline-code">--cors-origins</code> flag or{' '}
          <code className="inline-code">CENTY_CORS_ORIGINS</code> environment
          variable
        </li>
        <li className="daemon-help-list-item">
          Consider using HTTPS when exposing your daemon over the internet
        </li>
        <li className="daemon-help-list-item">
          The daemon stores project data locally - be careful about who has
          access
        </li>
      </ul>
    </>
  )
}
