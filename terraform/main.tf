# Cloudflare Pages project for centy-app
resource "cloudflare_pages_project" "app" {
  account_id        = var.cloudflare_account_id
  name              = var.project_name
  production_branch = "main"

  # Build configuration is handled by OpenNext/Wrangler in CI/CD
  # Direct upload mode - no build config needed here
}

# Custom domain for the Pages project
resource "cloudflare_pages_domain" "app" {
  account_id   = var.cloudflare_account_id
  project_name = cloudflare_pages_project.app.name
  domain       = "app.centy.io"

  depends_on = [cloudflare_pages_project.app]
}

# DNS CNAME record pointing to the Pages project
resource "cloudflare_record" "app" {
  zone_id = var.cloudflare_zone_id
  name    = "app"
  content = "${cloudflare_pages_project.app.subdomain}"
  type    = "CNAME"
  proxied = true
  ttl     = 1 # Auto TTL when proxied
}
