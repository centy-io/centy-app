'use client'

import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UntrackProjectRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

async function untrackProject(projectPath: string): Promise<string | null> {
  const request = create(UntrackProjectRequestSchema, { projectPath })
  const response = await centyClient.untrackProject(request)
  if (!response.success && response.error) return response.error
  return null
}

async function removeAllFromDaemon(
  archivedProjects: ProjectInfo[],
  archivedPathsNotInDaemon: string[],
  removeArchivedProject: (path: string) => void
): Promise<string | null> {
  for (const project of archivedProjects) {
    const err = await untrackProject(project.path)
    if (err) return err
    removeArchivedProject(project.path)
  }
  for (const path of archivedPathsNotInDaemon) {
    removeArchivedProject(path)
  }
  return null
}

async function removeProjectFromDaemon(
  projectPath: string,
  removeArchivedProject: (path: string) => void,
  setAllProjects: React.Dispatch<React.SetStateAction<ProjectInfo[]>>,
  setMutationError: (err: string | null) => void
): Promise<void> {
  const err = await untrackProject(projectPath)
  if (err) {
    setMutationError(err)
  } else {
    removeArchivedProject(projectPath)
    setAllProjects(prev => prev.filter(p => p.path !== projectPath))
  }
}

export const untrackProjectHelpers = {
  untrackProject,
  removeAllFromDaemon,
  removeProjectFromDaemon,
}
