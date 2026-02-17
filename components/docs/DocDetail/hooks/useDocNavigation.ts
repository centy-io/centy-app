import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { RouteLiteral } from 'nextjs-routes'
import { useProjectPathToUrl } from '@/components/providers/PathContextProvider'
import { useAppLink } from '@/hooks/useAppLink'

export function useDocNavigation(
  projectPath: string,
  docsListUrl: RouteLiteral
) {
  const router = useRouter()
  const { createLink, createProjectLink } = useAppLink()
  const resolvePathToUrl = useProjectPathToUrl()
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)

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
        router.push(docsListUrl)
      }
    },
    [resolvePathToUrl, createProjectLink, router, docsListUrl]
  )

  const handleDuplicated = useCallback(
    async (newSlug: string, targetProjectPath: string) => {
      if (targetProjectPath === projectPath) {
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
          router.push(docsListUrl)
        }
      }
      setShowDuplicateModal(false)
    },
    [
      projectPath,
      router,
      createLink,
      resolvePathToUrl,
      createProjectLink,
      docsListUrl,
    ]
  )

  return {
    showMoveModal,
    showDuplicateModal,
    setShowMoveModal,
    setShowDuplicateModal,
    handleMoved,
    handleDuplicated,
  }
}
