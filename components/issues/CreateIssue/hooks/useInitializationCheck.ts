import { useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { centyClient } from '@/lib/grpc/client'
import { IsInitializedRequestSchema } from '@/gen/centy_pb'

export function useInitializationCheck(
  projectPath: string,
  isInitialized: boolean | null,
  setIsInitialized: (v: boolean | null) => void
) {
  useEffect(() => {
    if (projectPath && isInitialized === null) {
      if (!projectPath.trim()) {
        setIsInitialized(null)
        return
      }
      const check = async () => {
        try {
          const request = create(IsInitializedRequestSchema, {
            projectPath: projectPath.trim(),
          })
          const response = await centyClient.isInitialized(request)
          setIsInitialized(response.initialized)
        } catch {
          setIsInitialized(false)
        }
      }
      check()
    }
  }, [projectPath, isInitialized, setIsInitialized])
}
