'use client'

import { useState, useEffect } from 'react'
import { generateSlug } from '@/lib/generate-slug'

export function useUserIdState(name: string) {
  const [userId, setUserId] = useState('')
  const [userIdManuallySet, setUserIdManuallySet] = useState(false)
  useEffect(() => {
    if (!userIdManuallySet && name) setUserId(generateSlug(name))
  }, [name, userIdManuallySet])
  const onUserIdChange = (v: string) => {
    setUserId(v)
    setUserIdManuallySet(true)
  }
  return { userId, onUserIdChange }
}
