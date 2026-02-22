/* eslint-disable max-lines, max-lines-per-function */
'use client'

import { useState } from 'react'
import { create } from '@bufbuild/protobuf'
import { HookDefinitionSchema } from '@/gen/centy_pb'
import type { HookDefinition } from '@/gen/centy_pb'

interface HooksEditorProps {
  hooks: HookDefinition[]
  onChange: (hooks: HookDefinition[]) => void
}

interface HookRowProps {
  hook: HookDefinition
  index: number
  onRemove: () => void
  onChange: (updates: Partial<HookDefinition>) => void
}

function HookRow({ hook, index, onRemove, onChange }: HookRowProps) {
  const timeoutSeconds = hook.timeout > 0n ? Number(hook.timeout) : 30

  return (
    <div className="hook-item">
      <div className="hook-fields">
        <div className="hook-field">
          <label
            className="hook-field-label"
            htmlFor={`hook-pattern-${index}`}
          >
            Pattern
          </label>
          <input
            id={`hook-pattern-${index}`}
            type="text"
            className="hook-input"
            value={hook.pattern}
            onChange={e => onChange({ pattern: e.target.value })}
            placeholder="pre:item:create"
          />
        </div>
        <div className="hook-field">
          <label
            className="hook-field-label"
            htmlFor={`hook-command-${index}`}
          >
            Command
          </label>
          <input
            id={`hook-command-${index}`}
            type="text"
            className="hook-input"
            value={hook.command}
            onChange={e => onChange({ command: e.target.value })}
            placeholder="./hooks/on-create.sh"
          />
        </div>
        <div className="hook-field hook-field-inline">
          <div className="hook-checkbox-group">
            <label className="hook-checkbox-label">
              <input
                className="hook-checkbox"
                type="checkbox"
                checked={hook.enabled}
                onChange={e => onChange({ enabled: e.target.checked })}
              />
              Enabled
            </label>
            <label className="hook-checkbox-label">
              <input
                className="hook-checkbox"
                type="checkbox"
                checked={hook.runAsync}
                onChange={e => onChange({ runAsync: e.target.checked })}
              />
              Async
            </label>
          </div>
          <div className="hook-timeout">
            <label
              className="hook-field-label"
              htmlFor={`hook-timeout-${index}`}
            >
              Timeout (s)
            </label>
            <input
              id={`hook-timeout-${index}`}
              type="number"
              className="hook-input hook-input-narrow"
              value={timeoutSeconds}
              min={1}
              onChange={e =>
                onChange({
                  timeout: BigInt(Math.max(1, parseInt(e.target.value, 10) || 30)),
                })
              }
            />
          </div>
        </div>
      </div>
      <button
        type="button"
        className="hook-remove-btn"
        onClick={onRemove}
        aria-label="Remove hook"
      >
        ✕
      </button>
    </div>
  )
}

function HooksHelpSection() {
  return (
    <div className="hooks-help">
      <h4 className="hooks-help-title">Hook Pattern Format</h4>
      <p className="hooks-help-text">
        Patterns use the format{' '}
        <code className="inline-code">phase:subject:action</code>, where{' '}
        <code className="inline-code">phase</code> is{' '}
        <code className="inline-code">pre</code> or{' '}
        <code className="inline-code">post</code>. Use{' '}
        <code className="inline-code">*</code> to match any segment.
      </p>

      <h4 className="hooks-help-title">Create Item Hook</h4>
      <p className="hooks-help-text">
        Issues and docs share a unified{' '}
        <code className="inline-code">item:create</code> hook. Use the{' '}
        <code className="inline-code">CENTY_ITEM_KIND</code> environment
        variable to distinguish between them:
      </p>
      <pre className="hooks-help-pre">
        <code className="hooks-help-code">{`# .centy/config.yaml hook example
pattern: pre:item:create
command: ./hooks/on-create.sh

# Inside on-create.sh:
# $CENTY_ITEM_KIND  →  "issue" or "doc"
# $CENTY_PROJECT_PATH  →  /path/to/project`}</code>
      </pre>

      <h4 className="hooks-help-title">Common Patterns</h4>
      <table className="hooks-pattern-table">
        <thead className="hooks-pattern-head">
          <tr className="hooks-pattern-row">
            <th className="hooks-pattern-cell">Pattern</th>
            <th className="hooks-pattern-cell">Fires on</th>
          </tr>
        </thead>
        <tbody className="hooks-pattern-body">
          <tr className="hooks-pattern-row">
            <td className="hooks-pattern-cell">
              <code className="inline-code">pre:item:create</code>
            </td>
            <td className="hooks-pattern-cell">Before any issue or doc is created</td>
          </tr>
          <tr className="hooks-pattern-row">
            <td className="hooks-pattern-cell">
              <code className="inline-code">post:item:create</code>
            </td>
            <td className="hooks-pattern-cell">After any issue or doc is created</td>
          </tr>
          <tr className="hooks-pattern-row">
            <td className="hooks-pattern-cell">
              <code className="inline-code">*:item:*</code>
            </td>
            <td className="hooks-pattern-cell">All item lifecycle events</td>
          </tr>
          <tr className="hooks-pattern-row">
            <td className="hooks-pattern-cell">
              <code className="inline-code">*:*:delete</code>
            </td>
            <td className="hooks-pattern-cell">After anything is deleted</td>
          </tr>
          <tr className="hooks-pattern-row">
            <td className="hooks-pattern-cell">
              <code className="inline-code">*:*:*</code>
            </td>
            <td className="hooks-pattern-cell">All lifecycle events</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export function HooksEditor({ hooks, onChange }: HooksEditorProps) {
  const [showHelp, setShowHelp] = useState(false)

  const handleAdd = () => {
    const newHook = create(HookDefinitionSchema, {
      pattern: '',
      command: '',
      runAsync: false,
      timeout: 30n,
      enabled: true,
    })
    onChange([...hooks, newHook])
  }

  const handleRemove = (index: number) => {
    onChange(hooks.filter((_, i) => i !== index))
  }

  const handleChange = (index: number, updates: Partial<HookDefinition>) => {
    onChange(hooks.map((h, i) => (i === index ? { ...h, ...updates } : h)))
  }

  return (
    <div className="hooks-editor">
      <div className="hooks-list">
        {hooks.map((hook, i) => (
          <HookRow
            key={i}
            hook={hook}
            index={i}
            onRemove={() => handleRemove(i)}
            onChange={updates => handleChange(i, updates)}
          />
        ))}
        {hooks.length === 0 && (
          <p className="hooks-empty">No hooks configured</p>
        )}
      </div>

      <div className="hooks-actions">
        <button type="button" className="hook-add-btn" onClick={handleAdd}>
          + Add Hook
        </button>
        <button
          type="button"
          className="help-toggle"
          onClick={() => setShowHelp(prev => !prev)}
        >
          {showHelp ? 'Hide' : 'Show'} pattern reference
        </button>
      </div>

      {showHelp && <HooksHelpSection />}
    </div>
  )
}
