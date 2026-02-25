'use client'

import { useState, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import type { RouteLiteral } from 'nextjs-routes'
import type { NavItemType } from './NavItemType'
import { ListItemTypesRequestSchema } from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'
import { resolveProject } from '@/lib/project-resolver'

function buildItemHref(
  org: string,
  project: string,
  plural: string
): RouteLiteral {
  return Object.assign(`/${org}/${project}/${plural}`, {
    __brand: 'RouteLiteral' as const,
  })
}

export function useNavItemTypes(
  hasProjectContext: boolean,
  effectiveOrg: string | undefined,
  effectiveProject: string | undefined
): NavItemType[] {
  const [itemTypes, setItemTypes] = useState<NavItemType[]>([])

  useEffect(() => {
    if (!hasProjectContext || !effectiveOrg || !effectiveProject) {
      setItemTypes([])
      return
    }
    let cancelled = false
    async function fetchItemTypes() {
      try {
        const resolution = await resolveProject(
          effectiveOrg!,
          effectiveProject!
        )
        if (cancelled || !resolution) return
        const req = create(ListItemTypesRequestSchema, {
          projectPath: resolution.projectPath,
        })
        const res = await centyClient.listItemTypes(req)
        if (cancelled) return
        setItemTypes(
          res.itemTypes
            .map(t => ({
              name: t.name,
              plural: t.plural,
              itemCount: t.itemCount,
              href: buildItemHref(effectiveOrg!, effectiveProject!, t.plural),
            }))
            .sort((a, b) => b.itemCount - a.itemCount)
        )
      } catch {
        // silently fall back to empty
      }
    }
    fetchItemTypes()
    return () => {
      cancelled = true
    }
  }, [hasProjectContext, effectiveOrg, effectiveProject])

  return itemTypes
}
