# Demo Mode - Allow exploring app with mock data when daemon disconnected

Add a Demo Mode to the web app that allows users to explore the app with sample data when the daemon is not connected.

## Key Features

- Prompt user with 'Try Demo Mode' option when daemon is disconnected
- Show full sample project with issues, PRs, docs, and assets
- Use Proxy pattern on centyClient to intercept calls (no component changes needed)
- Expose window.**CENTY_MOCK** API for E2E testing
- In-memory only (resets on page refresh)

## Implementation

**Create:**

- lib/grpc/demo-data.ts - Sample data definitions
- lib/grpc/mock-handlers.ts - Mock implementations for each RPC method
- components/layout/DemoModeIndicator.tsx - Banner shown when in demo mode

**Modify:**

- lib/grpc/client.ts - Add proxy wrapper and demo mode exports
- components/providers/DaemonStatusProvider.tsx - Add demo state management
- components/layout/DaemonDisconnectedOverlay.tsx - Add 'Try Demo Mode' button

## Sample Data

- 1 demo project (/demo/centy-showcase)
- 5-10 issues (various states, priorities)
- 3-4 docs (Getting Started, API Reference, Contributing Guide)
- 2-3 PRs (open, merged states)
- 2-3 sample users

## Related

Future @centy/sdk shared package will incorporate this mock mode functionality.
