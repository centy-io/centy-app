import {
  createMockConfig,
  createMockProjectInfo,
  createMockManifest,
} from './config-factories'
import type { Config, ProjectInfo, Manifest } from '@/gen/centy_pb'

export {
  createMockConfig,
  createMockProjectInfo,
  createMockManifest,
} from './config-factories'

/**
 * Default mock config for general use.
 */
export const mockConfig: Config = createMockConfig()

/**
 * Default mock project info for general use.
 */
export const mockProjectInfo: ProjectInfo = createMockProjectInfo()

/**
 * Default mock manifest for general use.
 */
export const mockManifest: Manifest = createMockManifest()

/**
 * Factory for creating project scenarios.
 */
export const createProjectScenario = {
  /** Returns an empty project list */
  empty: (): ProjectInfo[] => [],

  /** Returns a single project */
  single: (overrides?: Partial<ProjectInfo>): ProjectInfo[] => [
    createMockProjectInfo(overrides !== undefined ? overrides : {}),
  ],

  /** Returns multiple projects */
  many: (count: number): ProjectInfo[] =>
    Array.from({ length: count }, (_, i) =>
      createMockProjectInfo({
        path: `/project-${i + 1}`,
        name: `Project ${i + 1}`,
        displayPath: `/project-${i + 1}`,
        issueCount: i * 5,
        docCount: i * 2,
      })
    ),

  /** Returns projects with one favorite */
  withFavorite: (): ProjectInfo[] => [
    createMockProjectInfo({
      path: '/favorite-project',
      name: 'Favorite Project',
      isFavorite: true,
    }),
    createMockProjectInfo({
      path: '/regular-project',
      name: 'Regular Project',
      isFavorite: false,
    }),
  ],
}
