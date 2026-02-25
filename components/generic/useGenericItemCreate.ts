import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { useRouter } from 'next/navigation'
import { useItemTypeConfig } from './useItemTypeConfig'
import { centyClient } from '@/lib/grpc/client'
import { CreateItemRequestSchema } from '@/gen/centy_pb'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'

async function submitCreate(
  projectPath: string,
  itemType: string,
  title: string,
  status: string,
  customFields: Record<string, string>
) {
  return centyClient.createItem(
    create(CreateItemRequestSchema, {
      projectPath: projectPath.trim(),
      itemType,
      title: title.trim(),
      status,
      customFields,
    })
  )
}

export function useGenericItemCreate(itemType: string) {
  const { projectPath, isInitialized } = usePathContext()
  const { createLink } = useAppLink()
  const router = useRouter()
  const { config, loading: configLoading } = useItemTypeConfig(
    projectPath,
    isInitialized,
    itemType
  )

  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const [customFields, setCustomFields] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const displayName = config
    ? config.name.charAt(0).toUpperCase() + config.name.slice(1)
    : itemType.charAt(0).toUpperCase() + itemType.slice(1)

  useEffect(() => {
    if (config && config.defaultStatus && !status) {
      setStatus(config.defaultStatus)
    }
  }, [config, status])

  const listUrl = createLink(`/${itemType}`)

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!title.trim() || !projectPath.trim()) return
      setLoading(true)
      setError(null)
      try {
        const response = await submitCreate(
          projectPath,
          itemType,
          title,
          status,
          customFields
        )
        if (response.success && response.item) {
          router.push(createLink(`/${itemType}/${response.item.id}`))
        } else {
          setError(response.error || `Failed to create ${displayName}`)
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to connect to daemon'
        )
      } finally {
        setLoading(false)
      }
    },
    [
      projectPath,
      itemType,
      title,
      status,
      customFields,
      router,
      createLink,
      displayName,
    ]
  )

  return {
    projectPath,
    isInitialized,
    config,
    configLoading,
    title,
    setTitle,
    status,
    setStatus,
    customFields,
    setCustomFields,
    loading,
    error,
    listUrl,
    displayName,
    handleSubmit,
  }
}
