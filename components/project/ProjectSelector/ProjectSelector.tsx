'use client'

import {
  Root as PopoverRoot,
  Trigger as PopoverTrigger,
  Portal as PopoverPortal,
  Content as PopoverContent,
} from '@radix-ui/react-popover'
import { useProjectSelector } from './useProjectSelector'
import { ProjectSelectorDropdown } from './ProjectSelectorDropdown'

export function ProjectSelector() {
  const state = useProjectSelector()

  return (
    <PopoverRoot open={state.isOpen} onOpenChange={state.setIsOpen}>
      <PopoverTrigger asChild>
        <button className="project-selector-trigger" aria-haspopup="listbox">
          <span className="project-icon">{'\uD83D\uDCC1'}</span>
          <span className="project-name">{state.getCurrentProjectName()}</span>
          <span className="dropdown-arrow">
            {state.isOpen ? '\u25B2' : '\u25BC'}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          className="project-selector-dropdown"
          align="start"
          sideOffset={4}
          onOpenAutoFocus={e => {
            e.preventDefault()
            if (state.searchInputRef.current)
              state.searchInputRef.current.focus()
          }}
        >
          <ProjectSelectorDropdown
            loading={state.loading}
            error={state.error}
            searchQuery={state.searchQuery}
            setSearchQuery={state.setSearchQuery}
            searchInputRef={state.searchInputRef}
            visibleProjects={state.visibleProjects}
            groupedProjects={state.groupedProjects}
            projectPath={state.projectPath}
            collapsedOrgs={state.collapsedOrgs}
            manualPath={state.manualPath}
            setManualPath={state.setManualPath}
            fetchProjects={state.fetchProjects}
            setIsOpen={state.setIsOpen}
            handleSelectProject={state.handleSelectProject}
            handleManualSubmit={state.handleManualSubmit}
            handleToggleFavorite={state.handleToggleFavorite}
            handleArchiveProject={state.handleArchiveProject}
            toggleOrgCollapse={state.toggleOrgCollapse}
          />
        </PopoverContent>
      </PopoverPortal>
    </PopoverRoot>
  )
}
