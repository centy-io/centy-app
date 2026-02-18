import { useState, useCallback, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { GetDocRequestSchema, type Doc } from '@/gen/centy_pb'

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
      const request = create(GetDocRequestSchema, {
        projectPath,
        slug,
      })
      const response = await centyClient.getDoc(request)
      if (response.doc) {
        setDoc(response.doc)
        setEditTitle(response.doc.title)
        setEditContent(response.doc.content)
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
