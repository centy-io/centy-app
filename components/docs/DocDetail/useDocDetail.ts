import { useState } from 'react'
import { useDocFetch } from './useDocFetch'
import { useDocSave } from './useDocSave'
import { useDocDelete } from './useDocDelete'
import { useDocNavigation } from './useDocNavigation'
import { useAppLink } from '@/hooks/useAppLink'
import { useProject } from '@/components/providers/ProjectProvider'

export function useDocDetail(slug: string) {
  const { projectPath } = useProject()
  const { createLink } = useAppLink()
  const docsListUrl = createLink('/docs')
  const [isEditing, setIsEditing] = useState(false)
  const [showMoveModal, setShowMoveModal] = useState(false)
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)

  const fetchResult = useDocFetch(projectPath, slug)

  const { saving, handleSave } = useDocSave({
    projectPath,
    slug,
    editTitle: fetchResult.editTitle,
    editContent: fetchResult.editContent,
    editSlug: fetchResult.editSlug,
    setDoc: fetchResult.setDoc,
    setIsEditing,
    setError: fetchResult.setError,
  })

  const deleteResult = useDocDelete({
    projectPath,
    slug,
    setError: fetchResult.setError,
    docsListUrl,
  })

  const navResult = useDocNavigation(projectPath, docsListUrl)

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (!fetchResult.doc) return
    fetchResult.setEditTitle(fetchResult.doc.title)
    fetchResult.setEditContent(fetchResult.doc.content)
    fetchResult.setEditSlug('')
  }

  return {
    projectPath,
    docsListUrl,
    isEditing,
    setIsEditing,
    showMoveModal,
    setShowMoveModal,
    showDuplicateModal,
    setShowDuplicateModal,
    saving,
    handleSave,
    handleCancelEdit,
    ...fetchResult,
    ...deleteResult,
    ...navResult,
  }
}
