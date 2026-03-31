'use client'

import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  InitRequestSchema,
  GetReconciliationPlanRequestSchema,
  ExecuteReconciliationRequestSchema,
  ReconciliationDecisionsSchema,
  type ReconciliationPlan,
  type InitResponse,
} from '@/gen/centy_pb'

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

async function runGetPlan(
  projectPath: string
): Promise<{ plan: ReconciliationPlan; restore: string[] }> {
  const req = create(GetReconciliationPlanRequestSchema, {
    projectPath: projectPath.trim(),
  })
  const res = await centyClient.getReconciliationPlan(req)
  return { plan: res, restore: res.toRestore.map(f => f.path) }
}

async function runExecutePlan(
  projectPath: string,
  selectedRestore: Set<string>,
  selectedReset: Set<string>
): Promise<{ success: boolean; result?: InitResponse; error?: string }> {
  const decisions = create(ReconciliationDecisionsSchema, {
    restore: Array.from(selectedRestore),
    reset: Array.from(selectedReset),
  })
  const req = create(ExecuteReconciliationRequestSchema, {
    projectPath: projectPath.trim(),
    decisions,
  })
  const res = await centyClient.executeReconciliation(req)
  if (res.success) return { success: true, result: res }
  return { success: false, error: res.error || 'Initialization failed' }
}

export const initProjectApi = { runQuickInit, runGetPlan, runExecutePlan }
