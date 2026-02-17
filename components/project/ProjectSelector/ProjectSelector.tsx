'use client'

import * as Popover from '@radix-ui/react-popover'
import { useProjectSelector } from './useProjectSelector'
import { ProjectSelectorDropdown } from './ProjectSelectorDropdown'

export function ProjectSelector() {
  const hook = useProjectSelector()

  return (
    <Popover.Root open={hook.isOpen} onOpenChange={hook.setIsOpen}>
      <Popover.Trigger asChild>
        <button className="project-selector-trigger" aria-haspopup="listbox">
          <span className="project-icon">{'\uD83D\uDCC1'}</span>
          <span className="project-name">{hook.getCurrentProjectName()}</span>
          <span className="dropdown-arrow">
            {hook.isOpen ? '\u25B2' : '\u25BC'}
          </span>
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="project-selector-dropdown"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={e => {
            e.preventDefault()
            hook.searchInputRef.current?.focus()
          }}
        >
          <ProjectSelectorDropdown
            projectPath={hook.projectPath}
            projects={hook.projects}
            loading={hook.loading}
            error={hook.error}
            searchQuery={hook.searchQuery}
            setSearchQuery={hook.setSearchQuery}
            searchInputRef={hook.searchInputRef}
            selectedOrgSlug={hook.selectedOrgSlug}
            organizations={hook.organizations}
            collapsedOrgs={hook.collapsedOrgs}
            isArchived={hook.isArchived}
            fetchProjects={hook.fetchProjects}
            handleSelectProject={hook.handleSelectProject}
            handleArchiveProject={hook.handleArchiveProject}
            handleToggleFavorite={hook.handleToggleFavorite}
            toggleOrgCollapse={hook.toggleOrgCollapse}
            setIsOpen={hook.setIsOpen}
            manualPath={hook.manualPath}
            setManualPath={hook.setManualPath}
            handleManualSubmit={hook.handleManualSubmit}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}
