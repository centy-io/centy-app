import Link from 'next/link'

// Routes that require project context (no longer accessible at root level)
export const PROJECT_SCOPED_ROUTES = new Set(['issues', 'docs', 'users'])

/**
 * Component displayed when a project-scoped route is accessed without project context
 */
export function ProjectContextRequired({
  requestedPage,
}: {
  requestedPage: string
}) {
  const pageLabel =
    requestedPage === 'issues'
      ? 'Issues'
      : requestedPage === 'docs'
        ? 'Docs'
        : requestedPage === 'users'
          ? 'Users'
          : requestedPage

  return (
    <div className="project-context-required">
      <h2>Project Required</h2>
      <p>
        {pageLabel} are project-scoped. Please select a project to view its{' '}
        {pageLabel.toLowerCase()}.
      </p>
      <Link href="/organizations" className="select-project-link">
        Select a Project
      </Link>
    </div>
  )
}
