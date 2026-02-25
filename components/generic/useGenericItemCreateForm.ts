import { useState, useEffect } from 'react'
import type { ItemTypeConfigProto } from '@/gen/centy_pb'

export function useGenericItemCreateForm(config: ItemTypeConfigProto | null) {
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('')
  const [customFields, setCustomFields] = useState<Record<string, string>>({})

  useEffect(() => {
    if (config && config.defaultStatus && !status) {
      setStatus(config.defaultStatus)
    }
  }, [config, status])

  return { title, setTitle, status, setStatus, customFields, setCustomFields }
}
