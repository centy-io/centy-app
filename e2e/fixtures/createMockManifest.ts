import type { Manifest } from '@/gen/centy_pb'

const FIXED_DATE = '2024-01-15T10:30:00.000Z'

/**
 * Creates a mock manifest object.
 */
export function createMockManifest(overrides?: Partial<Manifest>): Manifest {
  const resolvedOverrides = overrides ?? {}
  const now = FIXED_DATE

  return {
    schemaVersion: resolvedOverrides.schemaVersion ?? 1,
    centyVersion: resolvedOverrides.centyVersion ?? '1.0.0',
    createdAt: resolvedOverrides.createdAt ?? now,
    $typeName: 'centy.v1.Manifest',
  }
}
