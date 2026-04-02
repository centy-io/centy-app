import { getPriorityLabel } from './getPriorityLabel'
import { ColorPicker } from '@/components/shared/ColorPicker'

interface PriorityItemProps {
  level: number
  totalLevels: number
  color: string
  onColorChange: (color: string) => void
}

export function PriorityItem({
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
