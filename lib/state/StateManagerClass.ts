import type { StateOption } from './StateOption'
import type { Config } from '@/gen/centy_pb'

/**
 * StateManager - Single source of truth for issue state options.
 * Handles default states, custom states from config, colors, and formatting.
 */
export class StateManager {
  private static DEFAULT_STATES: readonly ['open', 'in-progress', 'closed']
  private static DEFAULT_COLORS: Record<string, string>
  private static DEFAULT_STATE: string

  private config: Config | null
  private itemTypeStatuses: string[]

  static {
    StateManager.DEFAULT_STATES = ['open', 'in-progress', 'closed'] as const
    StateManager.DEFAULT_COLORS = {
      open: 'var(--color-state-open)',
      'in-progress': 'var(--color-state-in-progress)',
      closed: 'var(--color-state-closed)',
    }
    StateManager.DEFAULT_STATE = 'open'
  }

  constructor(config?: Config | null, itemTypeStatuses?: string[]) {
    this.config = config !== undefined ? config : null
    this.itemTypeStatuses = itemTypeStatuses ?? []
  }

  /**
   * Get the list of allowed states.
   * Returns config states if available, otherwise defaults.
   */
  getAllowedStates(): string[] {
    if (this.config && this.config.stateColors) {
      const states = Object.keys(this.config.stateColors)
      if (states.length > 0) {
        return states
      }
    }
    if (this.itemTypeStatuses.length > 0) {
      return [...this.itemTypeStatuses]
    }
    return [...StateManager.DEFAULT_STATES]
  }

  /**
   * Get the default state for new issues.
   * Returns config defaultState if available, otherwise 'open'.
   */
  getDefaultState(): string {
    return (
      (this.config && this.config.defaults && this.config.defaults['status']) ??
      StateManager.DEFAULT_STATE
    )
  }

  /**
   * Get the color for a given state.
   * Returns config color if available, otherwise default color, or fallback.
   */
  getStateColor(state: string): string {
    const stateColors = this.config && this.config.stateColors
    const configColor = stateColors
      ? new Map(Object.entries(stateColors)).get(state)
      : undefined
    if (configColor) return configColor
    return (
      new Map(Object.entries(StateManager.DEFAULT_COLORS)).get(state) ??
      'var(--color-fallback)'
    )
  }

  /**
   * Get all state options formatted for dropdowns/selectors.
   */
  getStateOptions(): StateOption[] {
    const states = this.getAllowedStates()
    return states.map(state => ({
      value: state,
      label: this.formatStateLabel(state),
      color: this.getStateColor(state),
    }))
  }

  /**
   * Format a state value as a display label.
   * e.g., "in-progress" -> "In Progress"
   */
  formatStateLabel(state: string): string {
    return state
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Get the CSS class for a state.
   * Returns 'status-custom' if config has custom color, otherwise status-{state}.
   */
  getStateClass(state: string): string {
    const stateColors = this.config && this.config.stateColors
    if (stateColors && new Map(Object.entries(stateColors)).has(state)) {
      return 'status-custom'
    }
    switch (state) {
      case 'open':
        return 'status-open'
      case 'in-progress':
        return 'status-in-progress'
      case 'closed':
        return 'status-closed'
    }
    return ''
  }

  /**
   * Check if a state value is valid for this config.
   */
  isValidState(state: string): boolean {
    return this.getAllowedStates().includes(state)
  }

  /**
   * Get default colors (useful for StateListEditor).
   */
  static getDefaultColors(): Record<string, string> {
    return { ...StateManager.DEFAULT_COLORS }
  }

  /**
   * Get default states (useful for initialization).
   */
  static getDefaultStates(): readonly string[] {
    return StateManager.DEFAULT_STATES
  }
}
