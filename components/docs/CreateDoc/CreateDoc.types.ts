export interface UseCreateDocReturn {
  projectPath: string
  isInitialized: boolean | null
  title: string
  content: string
  slug: string
  loading: boolean
  error: string | null
  setTitle: (value: string) => void
  setContent: (value: string) => void
  setSlug: (value: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleCancel: () => Promise<void>
}
