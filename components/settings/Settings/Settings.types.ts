import type { Config } from '@/gen/centy_pb'

export interface UseSettingsActionsParams {
  projectPath: string
  config: Config | null
  originalConfig: Config | null
  setConfig: (config: Config | null) => void
  setOriginalConfig: (config: Config | null) => void
  setError: (error: string | null) => void
  setSuccess: (success: string | null) => void
}
