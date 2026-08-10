# Centy App

A React application built with Next.js and TypeScript, deployed to Cloudflare Pages.

**[📚 Documentation](https://docs.centy.io)** | **[Report an Issue](https://github.com/centy-io/centy-app/issues)**

## Prerequisites

- Node.js >= 20.0.0
- pnpm (latest version)
- Docker (for container builds)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:5180 in your browser
```

## Available Scripts

| Command              | Description                    |
| -------------------- | ------------------------------ |
| `pnpm dev`           | Start development server       |
| `pnpm build`         | Build for production           |
| `pnpm start`         | Serve the production build     |
| `pnpm test`          | Run tests                      |
| `pnpm test:watch`    | Run tests in watch mode        |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint`          | Check code with ESLint         |
| `pnpm lint:fix`      | Fix ESLint issues              |
| `pnpm format`        | Format code with Prettier      |
| `pnpm format:check`  | Check code formatting          |
| `pnpm spell`         | Check spelling                 |
| `pnpm knip`          | Find unused code               |

## Docker

```bash
# Build Docker image
docker build -t centy-app .

# Run container
docker run -p 3000:80 centy-app

# Open http://localhost:3000 in your browser
```

## CI/CD

This project uses GitHub Actions for CI/CD:

- **On Pull Request**: Runs linting, tests, and build (`ci.yml`)
- **On Push to Main**: After CI succeeds, builds and deploys the static export to Cloudflare Pages (`deploy.yml`)

### Required Secrets

| Secret                  | Description                     |
| ----------------------- | ------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare Pages API token      |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID           |

## Project Structure

```
app/          # Next.js App Router pages and layouts
components/   # Shared React components
hooks/        # Shared React hooks
lib/          # Utilities and client logic
proto/        # Protobuf definitions (pnpm proto regenerates gen/)
e2e/          # Playwright end-to-end tests
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

MIT - see [LICENSE](LICENSE) for details.
