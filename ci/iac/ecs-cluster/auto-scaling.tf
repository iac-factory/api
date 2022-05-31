resource "aws_appautoscaling_target" "ecs-cluster-auto-scaling-capacity" {
    max_capacity       = aws_ecs_service.service.desired_count * (aws_ecs_service.service.deployment_maximum_percent / 100)
    min_capacity       = (aws_ecs_service.service.deployment_minimum_healthy_percent / 100) * 2
    resource_id        = "service/${aws_ecs_cluster.cluster.name}/${aws_ecs_service.service.name}"
    scalable_dimension = "ecs:service:DesiredCount"
    service_namespace  = "ecs"

    lifecycle {
        ignore_changes = [
            max_capacity
        ]
    }
}

resource "aws_appautoscaling_policy" "ecs-cluster-auto-scaling-memory" {
    name               = "${local.name}-ECS-Memory-Auto-Scaling"
    policy_type        = "TargetTrackingScaling"
    resource_id        = aws_appautoscaling_target.ecs-cluster-auto-scaling-capacity.resource_id
    scalable_dimension = aws_appautoscaling_target.ecs-cluster-auto-scaling-capacity.scalable_dimension
    service_namespace  = aws_appautoscaling_target.ecs-cluster-auto-scaling-capacity.service_namespace

    target_tracking_scaling_policy_configuration {
        predefined_metric_specification {
            predefined_metric_type = "ECSServiceAverageMemoryUtilization"
        }

        target_value = 50
    }
}

resource "aws_appautoscaling_policy" "ecs-cluster-auto-scaling-cpu" {
    name               = "${local.name}-ECS-CPU-Auto-Scaling"
    policy_type        = "TargetTrackingScaling"
    resource_id        = aws_appautoscaling_target.ecs-cluster-auto-scaling-capacity.resource_id
    scalable_dimension = aws_appautoscaling_target.ecs-cluster-auto-scaling-capacity.scalable_dimension
    service_namespace  = aws_appautoscaling_target.ecs-cluster-auto-scaling-capacity.service_namespace

    target_tracking_scaling_policy_configuration {
        predefined_metric_specification {
            predefined_metric_type = "ECSServiceAverageCPUUtilization"
        }

        target_value = 30
    }
}
