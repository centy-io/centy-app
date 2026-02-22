import type { StateOption } from '@/lib/state'

export interface CreateOrgIssueFormProps {
  title: string
  setTitle: (value: string) => void
  description: string
  setDescription: (value: string) => void
  priority: number
  setPriority: (value: number) => void
  status: string
  setStatus: (value: string) => void
  loading: boolean
  error: string | null
  stateOptions: StateOption[]
  onSubmit: (e?: React.FormEvent) => void
  onCancel: () => void
}
