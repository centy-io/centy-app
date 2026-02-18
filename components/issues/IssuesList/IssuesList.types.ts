import type { MultiSelectOption } from '@/components/shared/MultiSelect'

export const PRIORITY_OPTIONS: MultiSelectOption[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]

export const getPriorityClass = (priorityLabel: string): string => {
  switch (priorityLabel.toLowerCase()) {
    case 'high':
    case 'critical':
      return 'priority-high'
    case 'medium':
    case 'normal':
      return 'priority-medium'
    case 'low':
      return 'priority-low'
  }
  if (priorityLabel.startsWith('P') || priorityLabel.startsWith('p')) {
    const num = parseInt(priorityLabel.slice(1))
    if (num === 1) return 'priority-high'
    if (num === 2) return 'priority-medium'
    return 'priority-low'
  }
  return ''
}
