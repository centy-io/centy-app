'use client'

import { type User } from '@/gen/centy_pb'

// Demo users
export const DEMO_USERS: User[] = [
  {
    $typeName: 'centy.v1.User',
    id: 'alice-developer',
    name: 'Alice Developer',
    email: 'alice@example.com',
    gitUsernames: ['alice-dev', 'alicedev'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-01T14:30:00Z',
    deletedAt: '',
  },
  {
    $typeName: 'centy.v1.User',
    id: 'bob-engineer',
    name: 'Bob Engineer',
    email: 'bob@example.com',
    gitUsernames: ['bob-eng'],
    createdAt: '2024-02-20T09:00:00Z',
    updatedAt: '2024-11-15T11:00:00Z',
    deletedAt: '',
  },
  {
    $typeName: 'centy.v1.User',
    id: 'charlie-designer',
    name: 'Charlie Designer',
    email: 'charlie@example.com',
    gitUsernames: ['charlie-design'],
    createdAt: '2024-03-10T08:00:00Z',
    updatedAt: '2024-10-20T16:00:00Z',
    deletedAt: '',
  },
]
