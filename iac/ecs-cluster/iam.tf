resource "aws_iam_role" "ecs-task-execution-role" {
    name               = "${local.name}-ECS-Execution-Task-Role"
    assume_role_policy = data.aws_iam_policy_document.ecs-tasks-assume-role-policy.json
}

resource "aws_iam_role_policy_attachment" "ecs-task-execution-policy-attachment" {
    role       = aws_iam_role.ecs-task-execution-role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "ecs-task-execution-instance-profile" {
    name = "${local.name}-Execution-Task-Instance-Profile"
    role = aws_iam_role.ecs-task-execution-role.name
}

// resource "aws_lambda_permission" "load-balancer-forwarded-invocation" {
//     statement_id  = "AllowExecutionFromlb"
//     action        = "lambda:InvokeFunction"
//     /// function_name = aws_lambda_function.test.arn
//     principal     = "elasticloadbalancing.amazonaws.com"
//     source_arn    = aws_lb_target_group.application-load-balancer-http-target-group.arn
// }

resource "aws_iam_policy" "alb-logging-s3-policy" {
    name   = "${local.name}-Application-Load-Balancer-S3-Logging-Policy"
    policy = data.aws_iam_policy_document.application-load-balancer-logging-bucket-policy.json
}
