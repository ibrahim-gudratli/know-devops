variable "db_username" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "knowadmin"
}

variable "db_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}
