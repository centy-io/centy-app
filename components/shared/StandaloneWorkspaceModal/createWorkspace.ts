import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  OpenStandaloneWorkspaceRequestSchema,
  EditorType,
} from '@/gen/centy_pb'

interface CreateWorkspaceParams {
  projectPath: string
  name: string
  description: string
  ttlHours: number
  selectedEditor: EditorType
}

interface CreateWorkspaceResult {
  success: boolean
  workspacePath: string
  error?: string
}

export async function createWorkspace(
  params: CreateWorkspaceParams
): Promise<CreateWorkspaceResult> {
  const { projectPath, name, description, ttlHours, selectedEditor } = params

  const request = create(OpenStandaloneWorkspaceRequestSchema, {
    projectPath,
    name: name.trim() || undefined,
    description: description.trim() || undefined,
    agentName: '',
    ttlHours,
  })

  const clientMethod =
    selectedEditor === EditorType.VSCODE
      ? centyClient.openStandaloneWorkspaceVscode
      : centyClient.openStandaloneWorkspaceTerminal

  const response = await clientMethod(request)

  if (response.success) {
    return {
      success: true,
      workspacePath: response.workspacePath,
    }
  }

  return {
    success: false,
    workspacePath: '',
    error: response.error || 'Failed to create workspace',
  }
}
