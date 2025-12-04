output "pages_url" {
  description = "Default Cloudflare Pages URL"
  value       = "https://${cloudflare_pages_project.app.subdomain}"
}

output "custom_domain_url" {
  description = "Custom domain URL"
  value       = "https://app.centy.io"
}

output "project_name" {
  description = "Cloudflare Pages project name"
  value       = cloudflare_pages_project.app.name
}
