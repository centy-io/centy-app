import { useState, useEffect } from 'react'
import { useFetchComments, useAddComment } from './useCommentsFetch'
import { useUpdateComment, useDeleteComment } from './useCommentsMutate'
import type { GenericItem } from '@/gen/centy_pb'

export function useComments(
  projectPath: string,
  parentItemId: string,
  parentItemType: string
) {
  const [comments, setComments] = useState<GenericItem[]>([])
  const [error, setError] = useState<string | null>(null)

  const { fetchComments, loading } = useFetchComments(
    projectPath,
    parentItemId,
    setComments,
    setError
  )

  const { adding, addComment } = useAddComment(
    projectPath,
    parentItemId,
    parentItemType,
    setComments,
    setError
  )

  const { savingId, updateComment } = useUpdateComment(
    projectPath,
    comments,
    setComments,
    setError
  )

  const { deletingId, deleteComment } = useDeleteComment(
    projectPath,
    setComments,
    setError
  )

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return {
    comments,
    loading,
    error,
    adding,
    savingId,
    deletingId,
    addComment,
    updateComment,
    deleteComment,
  }
}
