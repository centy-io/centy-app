export function DisconnectedIcon() {
  return (
    <div className="daemon-disconnected-icon">
      <svg
        className="daemon-disconnected-svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line className="svg-line" x1="1" y1="1" x2="23" y2="23" />
        <path
          className="svg-path"
          d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"
        />
        <path className="svg-path" d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
        <path className="svg-path" d="M10.71 5.05A16 16 0 0 1 22.58 9" />
        <path className="svg-path" d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
        <path className="svg-path" d="M8.53 16.11a6 6 0 0 1 6.95 0" />
        <line className="svg-line" x1="12" y1="20" x2="12.01" y2="20" />
      </svg>
    </div>
  )
}
