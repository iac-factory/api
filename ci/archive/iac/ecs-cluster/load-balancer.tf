/// http://docs.aws.amazon.com/elasticloadbalancing/latest/APIReference/API_CreateTargetGroup.html

/// Target Group(s)
/// - "Target" is the group of service(s) or resource(s), where the request comes FROM
/// the ALB, and then TO another [Service(s) | Resource(s)]
/// - The mistake was made previously to set the target-group's target_type to ALB thinking it would
/// implicitly... work... kinda funny, but use that first point as reference.
///
/// Target Type
/// - instance - Register targets by instance ID. This is the default value.
/// - ip - Register targets by IP address. You can specify IP addresses from the subnets of the virtual private cloud (VPC) for the target group, the RFC 1918 range (10.0.0.0/8, 172.16.0.0/12, and 192.168.0.0/16), and the RFC 6598 range (100.64.0.0/10). You can't specify publicly routable IP addresses.
/// - lambda - Register a single Lambda function as a target.
/// - alb - Register a single Application Load Balancer as a target.

resource "aws_lb_target_group" "application-load-balancer-http-target-group" {
    name        = "${local.alias}-TG"
    port        = 80
    protocol    = "HTTP"
    target_type = "ip"

    vpc_id = aws_vpc.vpc.id

    /// @experimental (Potential Error via HTTP Protocol) protocol_version = "HTTP2

    stickiness {
        type            = "app_cookie"
        cookie_name     = "X-${local.name}-ALB-Cookie"
        enabled         = true
        cookie_duration = 86400 /// One Day
    }

    deregistration_delay          = "60"
    load_balancing_algorithm_type = "round_robin"

    lambda_multi_value_headers_enabled = false // Only applicable if target_type := lambda

    health_check {
        enabled = true

        healthy_threshold   = "3"
        interval            = "300"
        protocol            = "HTTP"
        matcher             = "200"
        timeout             = "3"
        path                = "/"
        unhealthy_threshold = "2"

        port = "traffic-port"
    }

    tags = {
        Name = "${local.name}-ALB-HTTP-TG"
    }
}

/***
 - enable_waf_fail_open - Allows requests through to backend target(s) when the application load balancer is unable to contact AWS Web Application Firewall (WAF).
 - access_logs - Access Logs delivers detailed logs of all requests made to Elastic Load Balancing. The logs are stored in Amazon S3.
 - client_port_preservation - Indicates whether the X-Forwarded-For header should preserve the source port that the client used to connect to the load balancer.
 - enable_waf_fail_open - Determines how the load balancer handles requests that might pose a security risk to your application.
    - defensive
    - strictest
    - monitor


    Outputs:
    - id - The ARN of the load balancer (matches arn).
    - arn - The ARN of the load balancer (matches id).
    - arn_suffix - The ARN suffix for use with CloudWatch Metrics.
    - dns_name - The DNS name of the load balancer.
    - tags_all - A map of tags assigned to the resource, including those inherited from the provider default_tags configuration block.
    - zone_id - The canonical hosted zone ID of the load balancer (to be used in a ArchiveRoute 53 Alias record).
    - subnet_mapping.*.outpost_id - ID of the Outpost containing the load balancer.
*/

resource "aws_alb" "application-load-balancer" {
    name               = "${local.alias}-ALB"
    internal           = false
    load_balancer_type = "application"
    subnets            = aws_subnet.public-subnet.*.id
    security_groups    = [ aws_security_group.application-load-balancer-http-security-group.id ]

    enable_http2                     = true
    drop_invalid_header_fields       = false
    enable_waf_fail_open             = false
    desync_mitigation_mode           = "defensive"
    enable_cross_zone_load_balancing = false /* Network LBs Only */
    enable_deletion_protection       = (var.environment == "Production") ? true : false

    access_logs {
        bucket  = aws_s3_bucket.application-load-balancer-logging-bucket.id
        enabled = true
    }

    tags = {
        Name = "${local.name}-ALB"
    }
}

resource "aws_lb_listener" "application-load-balancer-listener" {
    depends_on = [ aws_lb_target_group.application-load-balancer-http-target-group ]

    load_balancer_arn = aws_alb.application-load-balancer.id
    port              = "80"
    protocol          = "HTTP"

    default_action {
        type = "redirect"

        target_group_arn = aws_lb_target_group.application-load-balancer-http-target-group.arn

        redirect {
            port        = "443"
            protocol    = "HTTPS"
            status_code = "HTTP_301"
        }
    }
}

resource "aws_lb_listener" "application-load-balancer-listener-secure" {
    depends_on = [ aws_lb_target_group.application-load-balancer-http-target-group ]

    load_balancer_arn = aws_alb.application-load-balancer.id
    port              = "443"
    protocol          = "HTTPS"

    certificate_arn = aws_acm_certificate.certificate.arn

    default_action {
        type             = "forward"
        target_group_arn = aws_lb_target_group.application-load-balancer-http-target-group.id
    }
}

resource "aws_lb_listener_certificate" "application-load-balancer-listener-secure-certificate" {
    listener_arn    = aws_lb_listener.application-load-balancer-listener-secure.arn
    certificate_arn = aws_acm_certificate.certificate.arn
}

resource "aws_security_group" "application-load-balancer-http-security-group" {
    name        = "${local.name}-ALB-HTTP-SG"
    description = "ECS Application Load Balancer HTTP Traffic Security Group"
    vpc_id      = aws_vpc.vpc.id

    timeouts {
        create = "10m"
        delete = "10m"
    }

    ingress {
        from_port        = 80
        to_port          = 80
        protocol         = "tcp"
        cidr_blocks      = [ "0.0.0.0/0" ]
        ipv6_cidr_blocks = [ "::/0" ]
    }

    ingress {
        from_port        = 443
        to_port          = 443
        protocol         = "tcp"
        cidr_blocks      = [ "0.0.0.0/0" ]
        ipv6_cidr_blocks = [ "::/0" ]
    }

    egress {
        from_port        = 0
        to_port          = 0
        protocol         = "-1"
        cidr_blocks      = [ "0.0.0.0/0" ]
        ipv6_cidr_blocks = [ "::/0" ]
    }

    tags = {
        Name = "${local.name}-ALB-SG"
    }
}

resource "aws_s3_bucket" "application-load-balancer-logging-bucket" {
    bucket        = lower(join(".", [ "logging", local.fqdn ]))
    force_destroy = true
}

//resource "aws_s3_bucket_policy" "primary-bucket-policy" {
//    bucket = aws_s3_bucket.application-load-balancer-logging-bucket.id
//    policy = jsonencode({
//        "Version" : "2012-10-17",
//        "Statement" : [
//            {
//                "Sid" : "",
//                "Effect" : "Allow",
//                "Principal" : {
//                    "AWS" : [
//                        "arn:aws:iam::028463879607:root",
//                        "arn:aws:iam::700423713782:root"
//                    ]
//                },
//                "Action" : [
//                    "s3:*",
//                    "s3:RestoreObject",
//                    "s3:ReplicateTags",
//                    "s3:ReplicateObject",
//                    "s3:ReplicateDelete",
//                    "s3:PutReplicationConfiguration",
//                    "s3:PutObjectVersionTagging",
//                    "s3:PutObjectVersionAcl",
//                    "s3:PutObjectTagging",
//                    "s3:PutObjectRetention",
//                    "s3:PutObjectAcl",
//                    "s3:PutObject",
//                    "s3:ListMultipartUploadParts",
//                    "s3:ListBucket",
//                    "s3:InitiateReplication",
//                    "s3:GetObjectVersionTorrent",
//                    "s3:GetObjectVersionTagging",
//                    "s3:GetObjectVersionForReplication",
//                    "s3:GetObjectVersionAttributes",
//                    "s3:GetObjectVersionAcl",
//                    "s3:GetObjectVersion",
//                    "s3:GetObjectTorrent",
//                    "s3:GetObjectTagging",
//                    "s3:GetObjectRetention",
//                    "s3:GetObjectAttributes",
//                    "s3:GetObjectAcl",
//                    "s3:DeleteObjectVersionTagging",
//                    "s3:DeleteObjectVersion",
//                    "s3:DeleteObjectTagging"
//                ],
//                "Resource" : [
//                    aws_s3_bucket.application-load-balancer-logging-bucket.arn,
//                    join("/", [ aws_s3_bucket.application-load-balancer-logging-bucket.arn, "*" ])
//                ],
//                "Condition" : {
//                    "StringEquals" : {
//                        "aws:SourceAccount" : [
//                            "033677994240",
//                            data.aws_caller_identity.configuration.account_id
//                        ]
//                    }
//                }
//            },
//            {
//                "Sid" : "",
//                "Effect" : "Allow",
//                "Principal" : {
//                    "Service" : "delivery.logs.amazonaws.com"
//                },
//                "Action" : "s3:*",
//                "Resource" : [
//                    aws_s3_bucket.application-load-balancer-logging-bucket.arn,
//                    join("/", [ aws_s3_bucket.application-load-balancer-logging-bucket.arn, "*" ]),
//                ],
//                "Condition" : {
//                    "StringEquals" : {
//                        "s3:x-amz-acl" : "bucket-owner-full-control"
//                    }
//                }
//            }
//        ]
//    })
//}

resource "aws_s3_bucket_policy" "logging-policy" {
    bucket = aws_s3_bucket.application-load-balancer-logging-bucket.bucket
    policy = jsonencode({
        "Version" : "2012-10-17",
        "Statement" : [
            {
                "Effect" : "Allow",
                "Principal" : {
                    "AWS" : local.elb-principal-partition
                },
                "Action" : "s3:PutObject",
                "Resource" : local.s3-bucket-logging
            },
            {
                "Effect" : "Allow",
                "Principal" : {
                    "Service" : local.s3-log-delivery
                },
                "Action" : "s3:PutObject",
                "Resource" : local.s3-bucket-logging
                "Condition" : {
                    "StringEquals" : {
                        "s3:x-amz-acl" : "bucket-owner-full-control"
                    }
                }
            },
            {
                "Effect" : "Allow",
                "Principal" : {
                    "Service" : local.s3-log-delivery
                },
                "Action" : "s3:GetBucketAcl",
                "Resource" : local.s3-arn
            }
        ]
    })
}
