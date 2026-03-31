import type { ItemTypeConfigProto } from '@/gen/centy_pb'

export function buildItemDisplayName(
  config: ItemTypeConfigProto | null,
  itemType: string
): string {
  const name = config ? config.name : itemType
  return name.charAt(0).toUpperCase() + name.slice(1)
}
