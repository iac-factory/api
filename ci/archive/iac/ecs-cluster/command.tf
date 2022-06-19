resource "null_resource" "source-code-trigger" {
    triggers = zipmap(
        local.files,
        local.hashes
    )
}

resource "null_resource" "install" {
    triggers = null_resource.source-code-trigger.triggers

    provisioner "local-exec" {
        working_dir = join("/", [ path.root, "artifacts" ])
        command     = join(" ", [ "npm", "install", "." ])
    }
}

resource "null_resource" "compile" {
    triggers = null_resource.install.triggers

    provisioner "local-exec" {
        working_dir = join("/", [ path.root, "artifacts" ])
        command     = join(" ", [ "npm", "run", "build" ])
    }
}

resource "null_resource" "build" {
    triggers = null_resource.compile.triggers

    provisioner "local-exec" {
        working_dir = join("/", [ path.root, "artifacts" ])
        command     = join(" ", [ "docker", "build", "." ])
    }
}

resource "null_resource" "login" {
    triggers = null_resource.build.triggers

    provisioner "local-exec" {
        working_dir = join("/", [ path.root, "artifacts" ])
        command     = join(" ", [
            join(" ", [ "aws", "ecr", "get-login-password", "--region", var.region ]),
            "|",
            join(" ", [ "docker", "login", "--username", "AWS", "--password-stdin", local.registry ])
        ])
    }
}

resource "null_resource" "container" {
    triggers = null_resource.login.triggers

    provisioner "local-exec" {
        working_dir = join("/", [ path.root, "artifacts" ])
        command     = join(" ", [ "docker", "push", local.repository ])
    }
}
