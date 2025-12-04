# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate

# Copy package files and install production dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

# Copy built assets from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Expose port 3000 (Next.js default)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Start Next.js server
CMD ["pnpm", "start"]
