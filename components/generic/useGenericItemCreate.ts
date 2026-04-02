import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { submitCreate } from './submitCreate'
import { useGenericItemCreateForm } from './useGenericItemCreateForm'
import { useItemTypeConfig } from './useItemTypeConfig'
import { usePathContext } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'

function buildDisplayName(itemType: string, configName: string | null): string {
  const name = configName ? configName : itemType
  return name.charAt(0).toUpperCase() + name.slice(1)
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
  const { title, setTitle, status, setStatus, customFields, setCustomFields } =
    useGenericItemCreateForm(config)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const displayName = buildDisplayName(itemType, config ? config.name : null)
  const listUrl = createLink(`/${itemType}`)

  const handleSubmit = useCallback(
    (e: React.FormEvent): void => {
      e.preventDefault()
      void submitCreate(
        projectPath,
        itemType,
        title,
        status,
        customFields,
        displayName,
        setLoading,
        setError,
        id => router.push(createLink(`/${itemType}/${id}`))
      )
    },
    [
      projectPath,
      itemType,
      title,
      status,
      customFields,
      displayName,
      router,
      createLink,
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
