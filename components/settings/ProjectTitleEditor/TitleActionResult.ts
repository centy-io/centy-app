import type { ProjectInfo } from '@/gen/centy_pb'

export interface TitleActionResult {
  success: boolean
  project?: ProjectInfo
  error?: string
  message?: string
}
