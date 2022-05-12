/// Only limited one per environment -- refactor into distributed resource
/// resource "aws_accessanalyzer_analyzer" "access-analysis" {
///     depends_on = [aws_ecs_cluster.cluster, aws_alb.application-load-balancer, aws_vpc.vpc, aws_internet_gateway.igw]
///     analyzer_name = "${local.name}-Access-Analysis"
///     type = "ACCOUNT"
/// }
