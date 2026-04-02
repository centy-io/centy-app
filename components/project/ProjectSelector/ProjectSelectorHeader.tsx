'use client'

interface ProjectSelectorHeaderProps {
  loading: boolean
  onRefresh: () => void
}

export function ProjectSelectorHeader({
  loading,
  onRefresh,
}: ProjectSelectorHeaderProps) {
  return (
    <div className="project-selector-header">
      <h3 className="project-selector-title">Select Project</h3>
      <button
        className="refresh-btn"
        onClick={onRefresh}
        disabled={loading}
        title="Refresh project list"
      >
        {'\u21BB'}
      </button>
    </div>
  )
}
