resource "aws_ecr_repository" "registry" {
    name                 = lower(local.name)
    image_tag_mutability = "MUTABLE"

    encryption_configuration {
        encryption_type = "AES256"
    }

    image_scanning_configuration {
        scan_on_push = true
    }
}

resource "docker_image" "image" {
    depends_on = [ null_resource.compile ]
    name       = lower(join("-", [ local.name, "Container" ]))

    build {
        path = join("/", [ path.root, "artifacts" ])
        tag  = [
            local.repository,
            lower(local.container-name),
            join(":", [ local.repository, "latest" ]),
            lower(join(":", [ local.container-name, "latest" ]))
        ]
    }
}
