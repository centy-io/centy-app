export function DaemonHelpConnectionSection() {
  return (
    <>
      <h4 className="daemon-help-title">
        Using the Online App with Local Daemon
      </h4>
      <p className="daemon-help-text">
        To use <code className="inline-code">app.centy.io</code> with a daemon
        running on your local machine, you need to:
      </p>
      <ol className="daemon-help-list">
        <li className="daemon-help-list-item">
          <strong className="daemon-help-strong">
            Start the daemon with CORS enabled:
          </strong>
          <pre className="daemon-help-pre">
            <code className="inline-code">
              CENTY_CORS_ORIGINS=https://app.centy.io centy start
            </code>
          </pre>
          <p className="daemon-help-text">
            The <code className="inline-code">centy start</code> command will
            automatically install the daemon if it is not already installed. You
            can also start the daemon directly:
          </p>
          <pre className="daemon-help-pre">
            <code className="inline-code">
              centy-daemon --cors-origins=https://app.centy.io
            </code>
          </pre>
        </li>
        <li className="daemon-help-list-item">
          <strong className="daemon-help-strong">
            Set the daemon URL above to your local daemon address
          </strong>{' '}
          (default: <code className="inline-code">http://localhost:50051</code>)
        </li>
      </ol>
    </>
  )
}
