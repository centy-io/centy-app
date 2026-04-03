import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { ListProjectsRequestSchema, type ProjectInfo } from '@/gen/centy_pb'

export async function fetchProjectByPath(
  projectPath: string
): Promise<ProjectInfo | null> {
  const request = create(ListProjectsRequestSchema, {})
  const response = await centyClient.listProjects(request)
  const project = response.projects.find(p => p.path === projectPath)
  return project ?? null
}
