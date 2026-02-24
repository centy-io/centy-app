'use client'

import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UntrackProjectRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

export async function untrackProjectRequest(projectPath: string) {
  return centyClient.untrackProject(
    create(UntrackProjectRequestSchema, { projectPath })
  )
}

export async function removeAllArchived(
  archivedProjects: ProjectInfo[],
  archivedPathsNotInDaemon: string[],
  removeArchivedProject: (path: string) => void
): Promise<string | null> {
  for (const project of archivedProjects) {
    const response = await untrackProjectRequest(project.path)
    if (!response.success && response.error) return response.error
    removeArchivedProject(project.path)
  }
  for (const path of archivedPathsNotInDaemon) {
    removeArchivedProject(path)
  }
  return null
}
