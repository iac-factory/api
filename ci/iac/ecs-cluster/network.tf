resource "aws_internet_gateway" "igw" {
    vpc_id = aws_vpc.vpc.id

    tags = {
        Name = "${local.name}-IGW"
    }

}

resource "aws_subnet" "public-subnet" {
    vpc_id            = aws_vpc.vpc.id
    count             = length(local.public-subnets)
    cidr_block        = element(local.public-subnets, count.index)
    availability_zone = element(local.zones, count.index)

    map_public_ip_on_launch         = true
    assign_ipv6_address_on_creation = false

    tags = {
        Name = "${local.name}-Public-Subnet-${count.index + 1}"
    }
}

resource "aws_route_table" "public-routing-table" {
    vpc_id = aws_vpc.vpc.id

    tags = {
        Name = "${local.name}-Public-Routing-Table"
    }
}

resource "aws_route" "public-igw-route" {
    route_table_id         = aws_route_table.public-routing-table.id
    destination_cidr_block = "0.0.0.0/0"
    gateway_id             = aws_internet_gateway.igw.id
}

resource "aws_route_table_association" "public-routing-association" {
    count          = length(local.public-subnets)
    subnet_id      = element(aws_subnet.public-subnet.*.id, count.index)
    route_table_id = aws_route_table.public-routing-table.id
}

resource "aws_vpc_dhcp_options" "dhcp-options-set" {
    domain_name = join(".", [ data.aws_region.configuration.name, "compute", "internal" ])

    domain_name_servers = [
        "AmazonProvidedDNS"
    ]

    tags = {
        Name = "${local.name}-DHCP"
    }
}

resource "aws_vpc_dhcp_options_association" "dns-resolver" {
    vpc_id          = aws_vpc.vpc.id
    dhcp_options_id = aws_vpc_dhcp_options.dhcp-options-set.id
}
