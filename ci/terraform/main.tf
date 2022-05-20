/**
 * Usage:
 *
 * Example of 'foo_bar' module in `foo_bar.tf`.
 *
 * - list item 1
 * - list item 2
 *
 * Even inline **formatting** in _here_ is possible.
 * and some [link](https://domain.com/)
 *
 * * list item 3
 * * list item 4
 *
 * ```hcl
 * module "foo_bar" {
 *   source = "github.com/foo/bar"
 *
 *   id   = "1234567890"
 *   name = "baz"
 *
 *   zones = ["us-east-1", "us-west-1"]
 *
 *   tags = {
 *     Name         = "baz"
 *     Created-By   = "first.last@email.com"
 *     Date-Created = "20180101"
 *   }
 * }
 * ```
 *
 * Here is some trailing text after code block,
 * followed by another line of text.
 *
 * | Name | Description     |
 * |------|-----------------|
 * | Foo  | Foo description |
 * | Bar  | Bar description |
 */

terraform {
    required_providers {
        github = {
            source  = "integrations/github"
            version = "~> 4"
        }
    }

    backend "local" {
        path = "terraform.state.json"
    }
}

variable "owner" {
    default = "iac-factory"
}

variable "template" {
    default = [ ]
}

variable "topics" {
    default = [ "version-control", "terraform", "github", "auto-generated" ]
}

variable "license" {
    default = "BSD-2-Clause"
}

variable "username" {
    default = "Segmentational"
}

variable "token" {
    sensitive = true
}

variable "repository" {
    default = "cli-utilities"
}

variable "archive" {
    description = "Auto-Archive Upon Destruction ( true || false )"
    type        = bool
    /// validation {
    ///     condition     = var.auto-archive == true || var.auto-archive == false || var.auto-archive == "true" || var.auto-archive == "false"
    ///     error_message = "Value must be of type Boolean ( true || false )."
    /// }
}

data "github_user" "creator" {
    username = var.username
}

// this description for github_repository.repository
// which can be multiline.
resource "github_repository" "repository" {
    name                 = var.repository
    visibility           = "public"
    vulnerability_alerts = true

    // https://github.com/github/choosealicense.com/tree/gh-pages/_licenses
    license_template = var.license

    // https://github.com/github/gitignore
    gitignore_template = "Node"

    has_issues = true

    /*** @deprecated */
    has_downloads = false
    has_projects  = false
    has_wiki      = true

    homepage_url = "https://github.com/${var.owner}/${var.repository}"

    is_template = false

    archived           = false
    archive_on_destroy = false

    /// Ensure topics include reference to organization name; useful
    /// for search queries if the repository is set to public
    topics = concat(var.topics, [ var.owner.name ])

    // The most concise as it relate to git's DAG history
    allow_squash_merge = true

    allow_auto_merge   = false
    allow_merge_commit = false
    allow_rebase_merge = false

    delete_branch_on_merge = true

    dynamic "template" {
        for_each = var.template
        content {
            owner      = var.owner
            repository = template.value
        }
    }

    auto_init = true

    ignore_vulnerability_alerts_during_read = true
}

resource "github_branch_default" "branch" {
    branch     = "Development"
    repository = github_repository.repository.name
}

resource "github_branch_protection" "protection" {
    repository_id = github_repository.repository.node_id

    pattern          = github_branch_default.branch.branch
    enforce_admins   = true
    allows_deletions = true

    required_status_checks {
        strict = false
    }

    required_pull_request_reviews {
        dismiss_stale_reviews  = true
        restrict_dismissals    = true
        dismissal_restrictions = [ ]
    }

    push_restrictions = [
        # limited to a list of one type of restriction (user, team, app)
        # github_team.example.node_id
        data.github_user.creator.node_id
    ]
}

output "workspace" {
    description = "The local Terraform stateful workspace"
    value       = terraform.workspace
}

output "repository" {
    description = "GitHub repository information"
    value       = {
        definition = github_repository.repository
        branch     = {
            definition = github_branch_default.branch
            protection = github_branch_protection.protection
        }
    }
}

output "organization" {
    description = "The user-provided github.com organization"
    value       = var.owner
}

provider "github" {
    owner = var.owner
    token = var.token
}

provider "terraform" {}
/// provider "external" {}
/// provider "archive" {}
/// provider "random" {}
/// provider "local" {}
/// provider "http" {}
/// provider "null" {}
/// provider "aws" {}
