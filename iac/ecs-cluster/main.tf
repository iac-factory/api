resource "aws_cloudwatch_log_group" "log-group" {
    name              = format("%s-%s", local.name, "Log-Group")
    retention_in_days = 14
}

resource "aws_ecs_cluster" "cluster" {
    name = join("-", [ local.name, "Cluster" ])

    setting {
        name  = "containerInsights"
        value = "enabled"
    }
}

resource "aws_ecs_task_definition" "task-definition" {
    depends_on = [ /* data.aws_ecr_image.ecr-image */ docker_image.image ]

    family                = "service"
    container_definitions = jsonencode([
        {
            name        = lower(join("-", [ local.name, "Container" ]))
            image       = join(":", [ local.repository, "latest" ])
            networkMode = "awsvpc"
            essential   = true
            cpu         = 256
            memory      = 512

            entryPoint = [ ]

            environment : jsondecode(templatefile(join("/", [ path.cwd, "environment-variables.json" ]), {}))

            portMappings = [
                {
                    containerPort = 8080
                    hostPort      = 8080
                }
            ]

            logConfiguration = {
                logDriver = "awslogs"
                options   = {
                    awslogs-region        = var.region
                    awslogs-group         = aws_cloudwatch_log_group.log-group.name
                    awslogs-stream-prefix = "ecs-service"
                }
            }
        }
    ])

    requires_compatibilities = [ "FARGATE" ]
    network_mode             = "awsvpc"
    cpu                      = 256
    memory                   = 512
    execution_role_arn       = aws_iam_role.ecs-task-execution-role.arn
    task_role_arn            = aws_iam_role.ecs-task-execution-role.arn
}

resource "aws_ecs_service" "service" {
    name            = join("-", [ local.name, "HTTP-API-Service" ])
    cluster         = aws_ecs_cluster.cluster.id
    task_definition = aws_ecs_task_definition.task-definition.arn

    launch_type          = "FARGATE"
    scheduling_strategy  = "REPLICA"
    desired_count        = 3
    force_new_deployment = true

    deployment_maximum_percent         = 200
    deployment_minimum_healthy_percent = 100
    health_check_grace_period_seconds  = 180

    platform_version = "LATEST"

    lifecycle {
        ignore_changes = [ desired_count ]
    }

    network_configuration {
        subnets          = aws_subnet.public-subnet.*.id
        assign_public_ip = true
        security_groups  = [
            aws_security_group.ecs-cluster-service-private-security-group.id,
            aws_security_group.application-load-balancer-http-security-group.id
        ]
    }

    load_balancer {
        target_group_arn = aws_lb_target_group.application-load-balancer-http-target-group.arn
        container_name   = lower(join("-", [ local.name, "Container" ]))
        container_port   = 8080
    }

    deployment_controller {
        type = "ECS"
    }

    deployment_circuit_breaker {
        enable   = true
        rollback = true
    }

    propagate_tags = "SERVICE"

    /// enable_ecs_managed_tags = true

    /// wait_for_steady_state = true

    depends_on = [
        aws_lb_listener.application-load-balancer-listener,
        aws_alb.application-load-balancer
    ]

    timeouts {
        delete = "10m"
    }
}

resource "aws_security_group" "ecs-cluster-service-private-security-group" {
    vpc_id = aws_vpc.vpc.id

    description = "Egress + Ingress ALB to ECS Cluster"

    ingress {
        from_port        = 80
        to_port          = 80
        protocol         = "tcp"
        cidr_blocks      = [ "0.0.0.0/0" ]
        ipv6_cidr_blocks = [ "::/0" ]
    }

    ingress {
        from_port        = 8080
        to_port          = 8080
        protocol         = "tcp"
        cidr_blocks      = local.public-subnets[ * ]
        ipv6_cidr_blocks = [ ]
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
        Name = "${local.name}-ECS-Service-SG"
    }
}
