provider "aws" {
    region                   = var.region
    shared_config_files      = [ "~/.aws/config" ]
    shared_credentials_files = [ "~/.aws/credentials" ]
    profile                  = "default"

    skip_metadata_api_check = false

    default_tags {
        tags = merge(module.default-tags.tags, { Multi-Account = "True" })
    }
}

provider "aws" {
    alias                    = "Production"
    region                   = var.region
    shared_config_files      = [ "~/.aws/config" ]
    shared_credentials_files = [ "~/.aws/credentials" ]
    profile                  = "Production"

    access_key = (var.aws-access-key != "" && var.aws-access-key != null) ? var.aws-access-key : null
    secret_key = (var.aws-access-token != "" && var.aws-access-token != null) ? var.aws-access-token : null

    skip_metadata_api_check = false

    default_tags {
        tags = merge(module.default-tags.tags, { Account = "Development" })
    }
}

provider "docker" {
    host = "unix:///var/run/docker.sock"
}
