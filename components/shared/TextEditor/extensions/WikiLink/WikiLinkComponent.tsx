'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { NodeViewWrapper } from '@tiptap/react'
import type { NodeViewProps } from '@tiptap/react'
import { create } from '@bufbuild/protobuf'
import { GetItemRequestSchema } from '@/gen/centy_pb'
import { centyClient } from '@/lib/grpc/client'
import { useLinkRoutes } from '@/components/shared/LinkSection/useLinkRoutes'
import { usePathContext } from '@/components/providers/PathContextProvider'

export function WikiLinkComponent({ node, editor }: NodeViewProps) {
  const rawId = typeof node.attrs.id === 'string' ? node.attrs.id : ''
  const rawLabel = typeof node.attrs.label === 'string' ? node.attrs.label : ''
  const rawItemType =
    typeof node.attrs.itemType === 'string' ? node.attrs.itemType : 'issue'

  const { projectPath } = usePathContext()
  const { buildLinkRoute } = useLinkRoutes()

  const [displayLabel, setDisplayLabel] = useState(
    rawLabel && rawLabel !== rawId ? rawLabel : rawId
  )
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!rawId || !projectPath || fetchedRef.current) return
    if (rawLabel && rawLabel !== rawId) return
    fetchedRef.current = true

    void centyClient
      .getItem(
        create(GetItemRequestSchema, {
          projectPath,
          itemType: rawItemType,
          itemId: rawId,
        })
      )
      .then(res => {
        if (res.item?.title) setDisplayLabel(res.item.title)
      })
      .catch((_error: unknown) => {
        /* network errors expected */
      })
  }, [rawId, rawLabel, rawItemType, projectPath])

  const route = buildLinkRoute(rawItemType, rawId)

  return (
    <NodeViewWrapper as="span" className="wikilink-wrapper">
      <Link
        href={route}
        className="wikilink"
        data-wikilink-id={rawId}
        contentEditable={false}
        onClick={e => {
          if (editor.isEditable) e.preventDefault()
        }}
      >
        {displayLabel}
      </Link>
    </NodeViewWrapper>
  )
}
