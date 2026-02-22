// VS Code icon component
export function VscodeIcon() {
  return (
    <svg
      className="editor-icon vscode-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path className="svg-path" d="M17.583 17.222L8.528 8.167 2.75 13.944v2.111l4.917 4.195 9.916-3.028zm0-10.444L8.528 15.833 2.75 10.056V7.944l4.917-4.194 9.916 3.028zM2.75 10.056L8.528 12 2.75 13.944v-3.888zm14.833 10.166L21.25 18v-12l-3.667 2.222v7.778l.028 2.222z" />
    </svg>
  )
}

// Terminal icon component
export function TerminalIcon() {
  return (
    <svg
      className="editor-icon terminal-icon"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline className="svg-polyline" points="4 17 10 11 4 5"></polyline>
      <line className="svg-line" x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  )
}
