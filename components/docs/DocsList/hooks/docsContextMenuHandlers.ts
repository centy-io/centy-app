import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'

interface UseDocNavigationParams {
  projectPath: string
  fetchDocs: () => Promise<void>
  setShowDuplicateModal: (v: boolean) => void
  setSelectedDoc: (v: null) => void
}

export function useDocNavigation({
  projectPath,
  fetchDocs,
  setShowDuplicateModal,
  setSelectedDoc,
}: UseDocNavigationParams) {
  const router = useRouter()
  const resolvePathToUrl = useProjectPathToUrl()
  const { createLink, createProjectLink } = useAppLink()

  const handleMoved = useCallback(
    async (targetProjectPath: string) => {
      const result = await resolvePathToUrl(targetProjectPath)
      if (result) {
        const url = createProjectLink(
          result.orgSlug,
          result.projectName,
          'docs'
        )
        router.push(url)
      } else {
        router.push('/')
      }
    },
    [resolvePathToUrl, createProjectLink, router]
  )

  const handleDuplicated = useCallback(
    async (newSlug: string, targetProjectPath: string) => {
      if (targetProjectPath === projectPath) {
        fetchDocs()
        router.push(createLink(`/docs/${newSlug}`))
      } else {
        const result = await resolvePathToUrl(targetProjectPath)
        if (result) {
          const url = createProjectLink(
            result.orgSlug,
            result.projectName,
            `docs/${newSlug}`
          )
          router.push(url)
        } else {
          router.push('/')
        }
      }
      setShowDuplicateModal(false)
      setSelectedDoc(null)
    },
    [
      projectPath,
      router,
      fetchDocs,
      createLink,
      resolvePathToUrl,
      createProjectLink,
      setShowDuplicateModal,
      setSelectedDoc,
    ]
  )

  return { handleMoved, handleDuplicated }
}
