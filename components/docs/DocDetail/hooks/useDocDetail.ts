import { useState } from 'react'
import { useProject } from '@/components/providers/ProjectProvider'
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard'
import { useAppLink } from '@/hooks/useAppLink'
import { useDocFetch } from './useDocFetch'
import { useDocActions } from './useDocActions'
import { useDocNavigation } from './useDocNavigation'
import type { UseDocDetailReturn } from '../DocDetail.types'

export function useDocDetail(slug: string): UseDocDetailReturn {
  const { projectPath } = useProject()
  const { copyToClipboard } = useCopyToClipboard()
  const { createLink } = useAppLink()
  const docsListUrl = createLink('/docs')

  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const fetchState = useDocFetch(projectPath, slug)

  const { saving, deleting, handleSave, handleDelete, handleCancelEdit } =
    useDocActions({
      projectPath,
      slug,
      editTitle: fetchState.editTitle,
      editContent: fetchState.editContent,
      editSlug: fetchState.editSlug,
      doc: fetchState.doc,
      setDoc: fetchState.setDoc,
      setError: fetchState.setError,
      setIsEditing,
      setEditTitle: fetchState.setEditTitle,
      setEditContent: fetchState.setEditContent,
      setEditSlug: fetchState.setEditSlug,
      setShowDeleteConfirm,
      docsListUrl,
    })

  const navigation = useDocNavigation(projectPath, docsListUrl)

  return {
    doc: fetchState.doc,
    loading: fetchState.loading,
    error: fetchState.error,
    isEditing,
    editTitle: fetchState.editTitle,
    editContent: fetchState.editContent,
    editSlug: fetchState.editSlug,
    saving,
    deleting,
    showDeleteConfirm,
    showMoveModal: navigation.showMoveModal,
    showDuplicateModal: navigation.showDuplicateModal,
    docsListUrl,
    projectPath,
    setIsEditing,
    setEditTitle: fetchState.setEditTitle,
    setEditContent: fetchState.setEditContent,
    setEditSlug: fetchState.setEditSlug,
    setShowDeleteConfirm,
    setShowMoveModal: navigation.setShowMoveModal,
    setShowDuplicateModal: navigation.setShowDuplicateModal,
    handleSave,
    handleDelete,
    handleCancelEdit,
    handleMoved: navigation.handleMoved,
    handleDuplicated: navigation.handleDuplicated,
    copyToClipboard,
  }
}
