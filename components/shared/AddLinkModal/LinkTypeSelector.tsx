import type { LinkTypeInfo } from '@/gen/centy_pb'

interface LinkTypeSelectorProps {
  linkTypes: LinkTypeInfo[]
  selectedLinkType: string
  onLinkTypeChange: (value: string) => void
  loadingTypes: boolean
  targetTypeFilter: 'issue' | 'doc'
  onTargetTypeChange: (value: 'issue' | 'doc') => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function LinkTypeSelector({
  linkTypes,
  selectedLinkType,
  onLinkTypeChange,
  loadingTypes,
  targetTypeFilter,
  onTargetTypeChange,
  searchQuery,
  onSearchChange,
}: LinkTypeSelectorProps) {
  return (
    <>
      <div className="link-modal-field">
        <label>Link Type</label>
        {loadingTypes ? (
          <div className="link-modal-loading">Loading...</div>
        ) : (
          <select
            value={selectedLinkType}
            onChange={e => onLinkTypeChange(e.target.value)}
            className="link-modal-select"
          >
            {linkTypes.map(type => (
              <option key={type.name} value={type.name}>
                {type.name} {type.description ? `- ${type.description}` : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="link-modal-field">
        <label>Target Type</label>
        <div className="link-modal-tabs">
          <button
            className={`link-modal-tab ${targetTypeFilter === 'issue' ? 'active' : ''}`}
            onClick={() => onTargetTypeChange('issue')}
          >
            Issues
          </button>
          <button
            className={`link-modal-tab ${targetTypeFilter === 'doc' ? 'active' : ''}`}
            onClick={() => onTargetTypeChange('doc')}
          >
            Docs
          </button>
        </div>
      </div>

      <div className="link-modal-field">
        <label>Search</label>
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search by title or number..."
          className="link-modal-input"
        />
      </div>
    </>
  )
}
