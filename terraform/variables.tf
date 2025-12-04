variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Cloudflare zone ID for centy.io domain"
  type        = string
}

variable "project_name" {
  description = "Cloudflare Pages project name"
  type        = string
  default     = "centy-app"
}
