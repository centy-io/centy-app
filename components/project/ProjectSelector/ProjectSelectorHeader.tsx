'use client'

interface ProjectSelectorHeaderProps {
  loading: boolean
  onRefresh: () => Promise<void>
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
        onClick={() => void onRefresh()}
        disabled={loading}
        title="Refresh project list"
      >
        {'\u21BB'}
      </button>
    </div>
  )
}
