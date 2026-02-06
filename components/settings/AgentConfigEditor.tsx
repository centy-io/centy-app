'use client'

// Agent configuration was removed from the daemon proto.
// This component is kept as a placeholder to avoid breaking imports.
// The agent/LLM config is now managed entirely by the daemon.

export function AgentConfigEditor() {
  return (
    <div className="agent-config-editor">
      <p className="agent-empty">
        Agent configuration is now managed by the daemon and is no longer
        configurable from the app.
      </p>
    </div>
  )
}
