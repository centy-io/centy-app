import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import {
  InitRequestSchema,
  GetReconciliationPlanRequestSchema,
  ExecuteReconciliationRequestSchema,
  ReconciliationDecisionsSchema,
} from '@/gen/centy_pb'

export async function quickInit(projectPath: string) {
  const req = create(InitRequestSchema, {
    projectPath: projectPath.trim(),
    force: true,
  })
  return centyClient.init(req)
}

export async function getReconciliationPlan(projectPath: string) {
  const req = create(GetReconciliationPlanRequestSchema, {
    projectPath: projectPath.trim(),
  })
  return centyClient.getReconciliationPlan(req)
}

export async function executeReconciliation(
  projectPath: string,
  selectedRestore: Set<string>,
  selectedReset: Set<string>
) {
  const decisions = create(ReconciliationDecisionsSchema, {
    restore: Array.from(selectedRestore),
    reset: Array.from(selectedReset),
  })
  const req = create(ExecuteReconciliationRequestSchema, {
    projectPath: projectPath.trim(),
    decisions,
  })
  return centyClient.executeReconciliation(req)
}
