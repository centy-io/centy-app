'use client'

import { useState, useEffect } from 'react'
import { create } from '@bufbuild/protobuf'
import { route, type RouteLiteral } from 'nextjs-routes'
import type { NavItemType } from './NavItemType'
import { ListItemTypesRequestSchema } from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'
import { resolveProject } from '@/lib/project-resolver'

function buildItemHref(
  org: string,
  project: string,
  plural: string
): RouteLiteral {
  return route({
    pathname: '/[...path]',
    query: { path: [org, project, plural] },
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
    const org = effectiveOrg
    const project = effectiveProject
    let cancelled = false
    async function fetchItemTypes() {
      try {
        const resolution = await resolveProject(org, project)
        if (cancelled || !resolution) return
        const req = create(ListItemTypesRequestSchema, {
          projectPath: resolution.projectPath,
        })
        const res = await centyClient.listItemTypes(req)
        if (cancelled) return
        setItemTypes(
          res.itemTypes
            .map(t => ({
              name: t.plural.charAt(0).toUpperCase() + t.plural.slice(1),
              plural: t.plural,
              itemCount: 0,
              href: buildItemHref(org, project, t.plural),
            }))
            .sort(
              (a, b) =>
                b.itemCount - a.itemCount || a.name.localeCompare(b.name)
            )
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
