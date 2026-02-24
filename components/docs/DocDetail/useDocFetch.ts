import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { GetItemRequestSchema, type Doc } from '@/gen/centy_pb'
import { genericItemToDoc } from '@/lib/genericItemToDoc'

export function useDocFetch(projectPath: string, slug: string) {
  const [doc, setDoc] = useState<Doc | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editSlug, setEditSlug] = useState('')

  const fetchDoc = useCallback(async () => {
    if (!projectPath || !slug) {
      setError('Missing project path or document slug')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const request = create(GetItemRequestSchema, {
        projectPath,
        itemType: 'docs',
        itemId: slug,
      })
      const response = await centyClient.getItem(request)
      if (response.item) {
        const doc = genericItemToDoc(response.item)
        setDoc(doc)
        setEditTitle(doc.title)
        setEditContent(doc.content)
        setEditSlug('')
      } else {
        setError(response.error || 'Document not found')
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to connect to daemon'
      )
    } finally {
      setLoading(false)
    }
  }, [projectPath, slug])

  useEffect(() => {
    fetchDoc()
  }, [fetchDoc])

  return {
    doc,
    setDoc,
    loading,
    error,
    setError,
    editTitle,
    setEditTitle,
    editContent,
    setEditContent,
    editSlug,
    setEditSlug,
    fetchDoc,
  }
}
