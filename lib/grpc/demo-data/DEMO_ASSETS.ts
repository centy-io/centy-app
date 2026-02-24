'use client'

import { type Asset } from '@/gen/centy_pb'

// Demo assets
export const DEMO_ASSETS: Asset[] = [
  {
    $typeName: 'centy.v1.Asset',
    filename: 'screenshot.png',
    hash: 'demo-hash-1',
    size: BigInt(102400),
    mimeType: 'image/png',
    isShared: true,
    createdAt: '2024-12-15T10:00:00Z',
  },
  {
    $typeName: 'centy.v1.Asset',
    filename: 'diagram.svg',
    hash: 'demo-hash-2',
    size: BigInt(8192),
    mimeType: 'image/svg+xml',
    isShared: true,
    createdAt: '2024-12-16T11:00:00Z',
  },
]
