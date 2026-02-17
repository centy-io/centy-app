'use client'

import { type Doc } from '@/gen/centy_pb'
import { createDocMetadata } from './doc-helpers'

// Demo docs - contributing guide
export const DEMO_DOCS_PART2: Doc[] = [
  {
    $typeName: 'centy.v1.Doc',
    slug: 'contributing',
    title: 'Contributing Guide',
    content: `# Contributing to Centy

We welcome contributions! Here's how you can help.

## Development Setup

1. Clone the repository
2. Install dependencies: \`pnpm install\`
3. Start the development server: \`pnpm dev\`

## Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## Code Style

- Use TypeScript
- Follow the existing code patterns
- Add comments for complex logic
- Write meaningful commit messages

## Reporting Issues

Please use the issue tracker to report bugs or request features.
`,
    metadata: createDocMetadata('2024-03-01T08:00:00Z', '2024-10-20T16:00:00Z'),
  },
]
