'use client'

import type { ReactElement } from 'react'
import { useComments } from './useComments'
import { CommentItem } from './CommentItem'
import { AddCommentForm } from './AddCommentForm'
import { DaemonErrorMessage } from '@/components/shared/DaemonErrorMessage'

interface CommentThreadProps {
  projectPath: string
  parentItemId: string
  parentItemType: string
}

export function CommentThread({
  projectPath,
  parentItemId,
  parentItemType,
}: CommentThreadProps): ReactElement {
  const {
    comments,
    loading,
    error,
    adding,
    savingId,
    deletingId,
    addComment,
    updateComment,
    deleteComment,
  } = useComments(projectPath, parentItemId, parentItemType)

  return (
    <div className="comment-thread">
      <div className="comment-thread-header">
        <h3 className="comment-thread-title">
          Comments{comments.length > 0 ? ` (${comments.length})` : ''}
        </h3>
      </div>

      {error && <DaemonErrorMessage error={error} className="comment-error" />}

      {loading ? (
        <p className="comment-loading">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="comment-empty-state">No comments yet</p>
      ) : (
        <div className="comment-list">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              savingId={savingId}
              deletingId={deletingId}
              onUpdate={(id, body) => {
                void updateComment(id, body)
              }}
              onDelete={id => {
                void deleteComment(id)
              }}
            />
          ))}
        </div>
      )}

      <AddCommentForm adding={adding} onAdd={addComment} />
    </div>
  )
}
