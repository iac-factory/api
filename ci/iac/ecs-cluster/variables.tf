variable "organization" {
    description = "Organization Name"
    default     = "Conceptual"
    type        = string
}

variable "environment" {
    description = "Target Cloud Environment"
    type        = string
    default     = "Development"
}

variable "profile" {
    description = "Target Cloud Profile"
    default     = "default"
    type        = string
}

variable "region" {
    description = "Target Cloud Region"
    default     = "us-east-2"
    type        = string
}

variable "creator" {
    description = "Name (Human Identifiable)"
    type        = string
    default     = "Jacob Sanders"
}

variable "cloud" {
    description = "Cloud Provider"
    type        = string
    default     = "AWS"
}

variable "application" {
    description = "Application Name"
    type        = string
    default     = "POC"
}

variable "service" {
    description = "Application's Service Name"
    type        = string
    default     = "ECS"
}

variable "zone" {
    description = "Target Base Domain Name, AWS Route-53 Zone"
    type        = string
    default     = "pebblego.com"
}

variable "subdomain" {
    description = "Target Subdomain"
    type        = string
    default     = "api-ecs"
}

variable "base-domain" {
    description = "Base Hosted Zone FQDN"
    type        = string
    default     = "pebblego.com"
}

variable "aws-access-key" {
    description = "AWS-Access-Key-ID for Production Route-53 DNS Resource(s)"
    type        = string
    default     = ""
}

variable "aws-access-token" {
    description = "AWS-Secret-Access-Token for Production Route-53 DNS Resource(s)"
    type        = string
    default     = ""
}

variable "overwrite-dns-records" {
    description = "A Boolean that Will Overwrite Already Established DNS Records if Record(s) Exist"
    type        = bool
    default     = true
}

// variable "registry-token" {
//     description = "GitLab Private Registry API User Token"
//     type = string
// }
