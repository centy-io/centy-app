interface CopyButtonProps {
  copied: boolean
  onCopy: () => void
}

export function CopyButton({ copied, onCopy }: CopyButtonProps) {
  return (
    <button
      className="daemon-copy-button"
      onClick={onCopy}
      title="Copy to clipboard"
    >
      {copied ? (
        <svg
          className="copy-icon-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline className="svg-polyline" points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <svg
          className="copy-icon-svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect
            className="svg-rect"
            x="9"
            y="9"
            width="13"
            height="13"
            rx="2"
            ry="2"
          />
          <path
            className="svg-path"
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          />
        </svg>
      )}
    </button>
  )
}
