'use client'

import { createDocMetadata } from './doc-helpers'
import { type Doc } from '@/gen/centy_pb'

// Demo docs
export const DEMO_DOCS: Doc[] = [
  {
    $typeName: 'centy.v1.Doc',
    slug: 'getting-started',
    title: 'Getting Started',
    content: `# Getting Started with Centy

Welcome to Centy! This guide will help you get up and running quickly.

## Installation

\`\`\`bash
npm install -g centy
\`\`\`

## Quick Start

1. Initialize a new project:
\`\`\`bash
centy init
\`\`\`

2. Create your first issue:
\`\`\`bash
centy create issue --title "My first issue"
\`\`\`

3. List all issues:
\`\`\`bash
centy list issues
\`\`\`

## Next Steps

- Read the [API Reference](api-reference) for detailed documentation
- Check out the [Contributing Guide](contributing) to learn how to contribute
`,
    metadata: createDocMetadata('2024-01-15T10:00:00Z', '2024-12-01T14:00:00Z'),
  },
  {
    $typeName: 'centy.v1.Doc',
    slug: 'api-reference',
    title: 'API Reference',
    content: `# API Reference

This document describes the Centy API endpoints and their usage.

## Issues API

### List Issues
\`GET /api/issues\`

Returns a list of all issues in the project.

**Query Parameters:**
- \`status\` - Filter by status (open, in-progress, closed)
- \`priority\` - Filter by priority (1-3)
- \`limit\` - Maximum number of results

### Create Issue
\`POST /api/issues\`

Creates a new issue.

**Request Body:**
\`\`\`json
{
  "title": "Issue title",
  "description": "Issue description",
  "priority": 2,
  "status": "open"
}
\`\`\`

## Projects API

### List Projects
\`GET /api/projects\`

Returns all tracked projects.

### Get Project
\`GET /api/projects/:path\`

Returns details for a specific project.
`,
    metadata: createDocMetadata('2024-02-01T09:00:00Z', '2024-11-15T11:00:00Z'),
  },
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
