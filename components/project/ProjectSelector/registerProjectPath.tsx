'use client'

import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { RegisterProjectRequestSchema } from '@/gen/centy_pb'

export async function registerProjectPath(path: string) {
  return centyClient.registerProject(
    create(RegisterProjectRequestSchema, { projectPath: path })
  )
}
