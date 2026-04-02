/**
 * Centralized color definitions — single source of truth for all color values.
 *
 * CSS files reference these via CSS custom properties defined in styles/index.css.
 * TypeScript/TSX files import and destructure this object.
 *
 * rgba() values are only allowed here; everywhere else use CSS variables or this import.
 */
export const colors = {
  // Overlay colors (black-based)
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayDark: 'rgba(0, 0, 0, 0.85)',
  overlayMedium: 'rgba(0, 0, 0, 0.8)',
  overlayLight: 'rgba(0, 0, 0, 0.4)',
  shadowSubtle: 'rgba(0, 0, 0, 0.2)',
  shadowFaint: 'rgba(0, 0, 0, 0.1)',

  // White alpha
  white10: 'rgba(255, 255, 255, 0.1)',
  white15: 'rgba(255, 255, 255, 0.15)',
  white20: 'rgba(255, 255, 255, 0.2)',
  white25: 'rgba(255, 255, 255, 0.25)',
  white30: 'rgba(255, 255, 255, 0.3)',
  white50: 'rgba(255, 255, 255, 0.5)',
  white90: 'rgba(255, 255, 255, 0.9)',
  white95: 'rgba(255, 255, 255, 0.95)',

  // Status glow borders (semi-transparent status indicator borders)
  successGlow: 'rgba(74, 222, 128, 0.3)',
  dangerGlow: 'rgba(239, 68, 68, 0.3)',
  warningGlow: 'rgba(251, 191, 36, 0.3)',
  demoGlow: 'rgba(167, 139, 250, 0.3)',

  // Status alpha backgrounds
  dangerAlpha10: 'rgba(239, 68, 68, 0.1)',
  dangerAlpha20: 'rgba(239, 68, 68, 0.2)',
  warningAlpha15: 'rgba(251, 191, 36, 0.15)',
  warningAlpha25: 'rgba(251, 191, 36, 0.25)',
  warningAlpha40: 'rgba(251, 191, 36, 0.4)',
  warningAlpha60: 'rgba(251, 191, 36, 0.6)',
  successAlpha20: 'rgba(16, 185, 129, 0.2)',
  errorLight: 'rgba(255, 107, 107, 0.1)',

  // Default state colors (used as fallbacks when no user config is set)
  stateOpen: '#10b981',
  stateInProgress: '#f59e0b',
  stateClosed: '#6b7280',

  // Default priority colors
  priority1: '#ef4444',
  priority2: '#f59e0b',
  priority3: '#10b981',
  priority4: '#3b82f6',
  priority5: '#8b5cf6',

  // Fallback color (used when no color is defined)
  fallback: '#888888',

  // Semantic aliases used in components
  dangerRed: '#ef4444',
} as const
