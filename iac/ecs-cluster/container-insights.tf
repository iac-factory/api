// @experimental : Result := [?] [Unsuccessful][Successful]
resource "aws_ecs_account_setting_default" "account-settings" {
    name  = "containerInsights"
    value = "enabled"
}
