export interface CreateOrgIssueProps {
  orgSlug: string
}

export interface CreateOrgIssueFormProps {
  orgSlug: string
  title: string
  setTitle: (v: string) => void
  description: string
  setDescription: (v: string) => void
  priority: number
  setPriority: (v: number) => void
  status: string
  setStatus: (v: string) => void
  loading: boolean
  error: string | null
  stateOptions: { value: string; label: string }[]
  onSubmit: (e?: React.FormEvent) => void
  onCancel: () => void
}
