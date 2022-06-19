data "aws_region" "configuration" {}
data "aws_caller_identity" "configuration" {}
data "aws_canonical_user_id" "configuration" {}
data "aws_iam_account_alias" "configuration" {}
data "aws_partition" "configuration" {}
data "aws_default_tags" "configuration" {}

data "aws_region" "production" {
    provider = aws.Production
}

data "aws_caller_identity" "production" {
    provider = aws.Production
}

data "aws_canonical_user_id" "production" {
    provider = aws.Production
}

data "aws_iam_account_alias" "production" {
    provider = aws.Production
}

data "aws_partition" "production" {
    provider = aws.Production
}

data "aws_acm_certificate" "load-balancer-certificate" {
    domain = join(".", [ "*", lower(var.environment), lower(var.base-domain) ])
}

data "aws_availability_zones" "available" {
    state = "available"
}

data "aws_iam_policy_document" "ecs-agent-assume-role-policy" {
    statement {
        actions = [ "sts:AssumeRole" ]

        principals {
            type        = "Service"
            identifiers = [ "ec2.amazonaws.com" ]
        }
    }
}

data "aws_iam_policy_document" "ecs-tasks-assume-role-policy" {
    statement {
        actions = [ "sts:AssumeRole" ]

        principals {
            type        = "Service"
            identifiers = [ "ecs-tasks.amazonaws.com" ]
        }
    }
}

data "aws_ecs_task_definition" "service-primary" {
    task_definition = aws_ecs_task_definition.task-definition.family
}

data "template_file" "environment-variables" {
    template = file("environment-variables.json")
}

data "aws_iam_policy_document" "application-load-balancer-logging-bucket-policy" {
    statement {
        actions = [
            /// "s3:*"
            "s3:ListBucket",
            "s3:PutObject",
            "s3:DeleteObjectTagging",
            "s3:DeleteObjectVersion",
            "s3:DeleteObjectVersionTagging",
            "s3:GetObjectAcl",
            "s3:GetObjectAttributes",
            "s3:GetObjectRetention",
            "s3:GetObjectTagging",
            "s3:GetObjectTorrent",
            "s3:GetObjectVersion",
            "s3:GetObjectVersionAcl",
            "s3:GetObjectVersionAttributes",
            "s3:GetObjectVersionForReplication",
            "s3:GetObjectVersionTagging",
            "s3:GetObjectVersionTorrent",
            "s3:InitiateReplication",
            "s3:ListMultipartUploadParts",
            "s3:PutObject",
            "s3:PutObjectAcl",
            "s3:PutObjectRetention",
            "s3:PutObjectTagging",
            "s3:PutObjectVersionAcl",
            "s3:PutObjectVersionTagging",
            "s3:PutReplicationConfiguration",
            "s3:ReplicateDelete",
            "s3:ReplicateObject",
            "s3:ReplicateTags",
            "s3:RestoreObject"
        ]

        effect = "Allow"

        resources = [
            aws_s3_bucket.application-load-balancer-logging-bucket.arn,
            join("/", [ aws_s3_bucket.application-load-balancer-logging-bucket.arn, "*" ]),
            "arn:aws:s3:::${aws_s3_bucket.application-load-balancer-logging-bucket.bucket}/*"
        ]

        condition {
            test     = "StringEquals"
            variable = "aws:SourceAccount"
            values   = [
                "033677994240", /// Global Elastic Load Balancer Account-ID
                tostring(data.aws_caller_identity.configuration.account_id),
                tostring(data.aws_caller_identity.configuration.account_id)
            ]
        }

        condition {
            test     = "StringEquals"
            variable = "s3:x-amz-acl"

            values = [
                "bucket-owner-full-control"
            ]
        }
    }
}
