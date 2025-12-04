/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Cloudflare Pages deployment, we have two options:
  // 1. Static export (output: 'export') - requires all routes known at build time
  // 2. Edge runtime with @cloudflare/next-on-pages - supports dynamic routes
  //
  // Since this app has dynamic routes (/issues/[id], /docs/[slug]) that are
  // fetched at runtime, we need the edge runtime approach.
  // See: https://developers.cloudflare.com/pages/framework-guides/nextjs/
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
