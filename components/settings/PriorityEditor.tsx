/* eslint-disable max-lines */
'use client'

import { ColorPicker } from '@/components/shared/ColorPicker'

interface PriorityEditorProps {
  levels: number
  colors: Record<string, string>
  onLevelsChange: (levels: number) => void
  onColorsChange: (colors: Record<string, string>) => void
}

const DEFAULT_PRIORITY_COLORS: Record<string, string> = {
  '1': '#ef4444', // Red - highest
  '2': '#f59e0b', // Amber
  '3': '#10b981', // Green - lowest
  '4': '#3b82f6', // Blue
  '5': '#8b5cf6', // Purple
}

function getPriorityLabel(level: number, totalLevels: number): string {
  if (totalLevels <= 3) {
    const labels = ['High', 'Medium', 'Low']
    return labels[level - 1] || `P${level}`
  }
  if (totalLevels === 4) {
    const labels = ['Critical', 'High', 'Medium', 'Low']
    return labels[level - 1] || `P${level}`
  }
  return `P${level}`
}

function getColor(colors: Record<string, string>, level: number): string {
  return (
    colors[String(level)] || DEFAULT_PRIORITY_COLORS[String(level)] || '#888888'
  )
}

function cleanupColors(
  colors: Record<string, string>,
  newLevels: number
): Record<string, string> {
  const newColors: Record<string, string> = {}
  for (let i = 1; i <= newLevels; i++) {
    if (colors[String(i)]) {
      newColors[String(i)] = colors[String(i)]
    }
  }
  return newColors
}

interface PriorityItemProps {
  level: number
  totalLevels: number
  color: string
  onColorChange: (color: string) => void
}

function PriorityItem({
  level,
  totalLevels,
  color,
  onColorChange,
}: PriorityItemProps) {
  return (
    <div className="priority-item">
      <div className="priority-preview" style={{ backgroundColor: color }}>
        {getPriorityLabel(level, totalLevels)}
      </div>

      <span className="priority-level-label">Priority {level}</span>

      <ColorPicker value={color} onChange={onColorChange} />
    </div>
  )
}

export function PriorityEditor({
  levels,
  colors,
  onLevelsChange,
  onColorsChange,
}: PriorityEditorProps) {
  const handleColorChange = (level: number, color: string) => {
    onColorsChange({
      ...colors,
      [String(level)]: color,
    })
  }

  const handleLevelsChange = (newLevels: number) => {
    onLevelsChange(newLevels)
    onColorsChange(cleanupColors(colors, newLevels))
  }

  const priorityLevels = Array.from({ length: levels }, (_, i) => i + 1)

  return (
    <div className="priority-editor">
      <div className="priority-levels-selector">
        <label className="form-label" htmlFor="priority-levels">
          Number of priority levels:
        </label>
        <select
          id="priority-levels"
          value={levels}
          onChange={e => handleLevelsChange(Number(e.target.value))}
          className="priority-levels-select"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
            <option className="form-option" key={n} value={n}>
              {n} level{n > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="priority-list">
        {priorityLevels.map(level => (
          <PriorityItem
            key={level}
            level={level}
            totalLevels={levels}
            color={getColor(colors, level)}
            onColorChange={color => handleColorChange(level, color)}
          />
        ))}
      </div>

      <p className="priority-hint">
        Priority 1 is the highest priority. Labels are shown based on the number
        of levels.
      </p>
    </div>
  )
}
