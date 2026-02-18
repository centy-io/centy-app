'use client'

import type { User } from '@/gen/centy_pb'

interface UserMetadataProps {
  user: User
}

export function UserMetadata({ user }: UserMetadataProps) {
  return (
    <>
      <h1 className="user-name">{user.name}</h1>

      <div className="user-metadata">
        <div className="metadata-row">
          <span className="metadata-label">Email:</span>
          <span className="metadata-value">
            {user.email || <span className="no-value">Not set</span>}
          </span>
        </div>

        <div className="metadata-row">
          <span className="metadata-label">Git Usernames:</span>
          <span className="metadata-value">
            {user.gitUsernames.length > 0 ? (
              user.gitUsernames.map((username, i) => (
                <span key={i} className="git-username-badge">
                  {username}
                </span>
              ))
            ) : (
              <span className="no-value">None</span>
            )}
          </span>
        </div>

        <div className="metadata-row">
          <span className="metadata-label">Created:</span>
          <span className="metadata-value">
            {user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}
          </span>
        </div>

        {user.updatedAt && (
          <div className="metadata-row">
            <span className="metadata-label">Updated:</span>
            <span className="metadata-value">
              {new Date(user.updatedAt).toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </>
  )
}
