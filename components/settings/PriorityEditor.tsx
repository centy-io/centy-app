'use client'

import { PriorityItem } from './PriorityItem'
import { getPriorityColor } from './getPriorityColor'
import { cleanupPriorityColors } from './cleanupPriorityColors'

interface PriorityEditorProps {
  levels: number
  colors: Record<string, string>
  onLevelsChange: (levels: number) => void
  onColorsChange: (colors: Record<string, string>) => void
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
    onColorsChange(cleanupPriorityColors(colors, newLevels))
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
            color={getPriorityColor(colors, level)}
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
