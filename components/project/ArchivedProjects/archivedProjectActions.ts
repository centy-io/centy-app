import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { UntrackProjectRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

export async function untrackProject(projectPath: string) {
  const req = create(UntrackProjectRequestSchema, { projectPath })
  return centyClient.untrackProject(req)
}

export async function untrackAllProjects(
  archivedProjects: ProjectInfo[],
  archivedPathsNotInDaemon: string[],
  removeArchivedProject: (path: string) => void
): Promise<string | null> {
  for (const p of archivedProjects) {
    const res = await untrackProject(p.path)
    if (!res.success && res.error) {
      return res.error
    }
    removeArchivedProject(p.path)
  }
  for (const path of archivedPathsNotInDaemon) {
    removeArchivedProject(path)
  }
  return null
}
