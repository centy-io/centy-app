'use client'

interface ProjectSelectorEmptyStateProps {
  searchQuery: string
}

export function ProjectSelectorEmptyState({
  searchQuery,
}: ProjectSelectorEmptyStateProps) {
  return (
    <div className="project-selector-empty">
      {searchQuery ? (
        <>
          <p className="empty-state-text">
            No projects match &quot;{searchQuery}&quot;
          </p>
          <p className="hint">Try a different search term</p>
        </>
      ) : (
        <>
          <p className="empty-state-text">No tracked projects found</p>
          <p className="hint">Initialize a project with Centy to see it here</p>
        </>
      )}
    </div>
  )
}
