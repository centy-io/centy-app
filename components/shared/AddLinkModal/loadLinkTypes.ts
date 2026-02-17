import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  GetAvailableLinkTypesRequestSchema,
  type LinkTypeInfo,
} from '@/gen/centy_pb'

interface LoadLinkTypesResult {
  linkTypes: LinkTypeInfo[]
  defaultLinkType: string
}

export async function loadLinkTypes(
  projectPath: string
): Promise<LoadLinkTypesResult> {
  const request = create(GetAvailableLinkTypesRequestSchema, {
    projectPath,
  })
  const response = await centyClient.getAvailableLinkTypes(request)
  const defaultLinkType =
    response.linkTypes.length > 0 ? response.linkTypes[0].name : ''

  return {
    linkTypes: response.linkTypes,
    defaultLinkType,
  }
}
