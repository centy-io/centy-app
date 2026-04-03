'use client'

import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { InitRequestSchema, type InitResponse } from '@/gen/centy_pb'

async function runQuickInit(
  projectPath: string
): Promise<{ success: boolean; result?: InitResponse; error?: string }> {
  const req = create(InitRequestSchema, {
    projectPath: projectPath.trim(),
    force: true,
  })
  const res = await centyClient.init(req)
  if (res.success) return { success: true, result: res }
  return { success: false, error: res.error || 'Initialization failed' }
}

export const initProjectApi = { runQuickInit }
