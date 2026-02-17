import { useStateManager } from '@/lib/state'

interface StatusDropdownProps {
  stateOptions: { value: string; label: string }[]
  currentStatus: string | undefined
  onStatusChange: (status: string) => void
}

export function StatusDropdown({
  stateOptions,
  currentStatus,
  onStatusChange,
}: StatusDropdownProps) {
  const stateManager = useStateManager()

  return (
    <ul className="status-dropdown" role="listbox" aria-label="Status options">
      {stateOptions.map(option => (
        <li
          key={option.value}
          role="option"
          aria-selected={option.value === currentStatus}
          className={`status-option ${stateManager.getStateClass(option.value)} ${option.value === currentStatus ? 'selected' : ''}`}
          onClick={() => onStatusChange(option.value)}
        >
          {option.label}
        </li>
      ))}
    </ul>
  )
}
