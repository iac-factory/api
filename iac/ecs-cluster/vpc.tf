resource "aws_vpc" "vpc" {
    cidr_block           = "172.168.0.0/16"
    enable_dns_hostnames = true
    enable_dns_support   = true
    tags                 = {
        Name = "${local.name}-VPC"
    }
}
