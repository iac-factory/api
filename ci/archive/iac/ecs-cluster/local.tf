locals {
    name  = "${var.organization}-${var.environment}-${var.application}-${var.service}"
    alias = "${var.organization}-${var.environment}-${var.service}"

    zones = (var.region == "us-east-1") ? [
        join("", [ var.region, "a" ]),
        join("", [ var.region, "b" ]),
        join("", [ var.region, "c" ]),
        join("", [ var.region, "d" ]),
        join("", [ var.region, "e" ]),
        join("", [ var.region, "f" ])
    ] : [
        join("", [ var.region, "a" ]),
        join("", [ var.region, "b" ]),
        join("", [ var.region, "c" ])
    ]

    domain = join(".", [ var.subdomain, var.environment ])

    fqdn = join(".", [ local.domain, var.base-domain ])

    public-subnets = [
        "172.168.100.0/24",
        "172.168.101.0/24",
        "172.168.102.0/24"
    ]

    files = [ for file in fileset( join("/", [ path.root, "artifacts" ]), "**/*") : file ]

    artifacts = [ for file in local.files : join("/", [ path.cwd, "artifacts", file ]) ]

    hashes = [ for hash in local.artifacts : filesha1(hash) ]

    registry = "${data.aws_caller_identity.configuration.account_id}.dkr.ecr.${var.region}.amazonaws.com"

    repository = join("/", [ local.registry, lower(local.name) ])

    container-name = join("-", [ local.name, "Container" ])

    container = join(":", [ local.repository, "latest" ])

    elb-name                = aws_alb.application-load-balancer.name
    elb-partition           = join(":", [ "arn", data.aws_partition.configuration.partition, "iam" ])
    elb-principal-partition = join(":", [
        local.elb-partition,
        local.elb-account-identifiers[ var.region ],
        "root"
    ])

    elb-account-identifiers = {
        us-east-1  = "127311923021"
        us-east-2  = "033677994240"
        us-west-1  = "027434742980"
        us-west-2  = "797873946194"
        ca-central = "985666609251"
    }

    s3-bucket-logging = join("/", [
        local.s3-arn,
        local.s3-log-directory,
        data.aws_caller_identity.configuration.account_id,
        "*"
    ])

    s3-log-directory = "AWSLogs"
    s3-log-delivery  = "delivery.logs.amazonaws.com"
    s3-bucket-name   = aws_s3_bucket.application-load-balancer-logging-bucket.bucket
    s3-partition     = "arn:${data.aws_partition.configuration.partition}:s3::"
    s3-arn           = join(":", [ local.s3-partition, local.s3-bucket-name ])
}
