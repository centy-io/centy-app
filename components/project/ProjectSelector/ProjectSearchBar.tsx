'use client'

interface ProjectSearchBarProps {
  searchInputRef: React.RefObject<HTMLInputElement | null>
  searchQuery: string
  setSearchQuery: (v: string) => void
  loading: boolean
  onRefresh: () => void
}

export function ProjectSearchBar(props: ProjectSearchBarProps) {
  const { searchQuery, loading, onRefresh } = props
  return (
    <>
      <div className="project-selector-header">
        <h3>Select Project</h3>
        <button
          className="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh project list"
        >
          {'\u21BB'}
        </button>
      </div>
      <div className="project-selector-search">
        <input
          ref={props.searchInputRef}
          type="text"
          value={searchQuery}
          onChange={e => props.setSearchQuery(e.target.value)}
          placeholder="Search projects..."
          className="search-input"
        />
        {searchQuery && (
          <button
            className="search-clear-btn"
            onClick={() => props.setSearchQuery('')}
            title="Clear search"
          >
            &times;
          </button>
        )}
      </div>
    </>
  )
}
