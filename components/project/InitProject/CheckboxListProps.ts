import type { FileInfo } from '@/gen/centy_pb'

export interface CheckboxListProps {
  files: FileInfo[]
  title: string
  selected: Set<string>
  toggle: (path: string) => void
  description: string
}
