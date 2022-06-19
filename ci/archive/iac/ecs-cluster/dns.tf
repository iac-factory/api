data "aws_route53_zone" "zone" {
    provider = aws.Production
    name     = var.base-domain
}

resource "aws_route53_record" "subdomain-route-ipv4" {
    provider = aws.Production

    zone_id = data.aws_route53_zone.zone.id
    name    = local.domain
    type    = "A"

    allow_overwrite = var.overwrite-dns-records

    alias {
        name                   = aws_alb.application-load-balancer.dns_name
        zone_id                = aws_alb.application-load-balancer.zone_id
        evaluate_target_health = false
    }
}

resource "aws_route53_record" "subdomain-route-ipv6" {
    provider = aws.Production

    zone_id = data.aws_route53_zone.zone.id
    name    = local.domain
    type    = "AAAA"

    allow_overwrite = var.overwrite-dns-records

    alias {
        name                   = aws_alb.application-load-balancer.dns_name
        zone_id                = aws_alb.application-load-balancer.zone_id
        evaluate_target_health = false
    }
}

resource "aws_route53_record" "subdomain-route-www" {
    provider = aws.Production

    allow_overwrite = var.overwrite-dns-records

    zone_id = data.aws_route53_zone.zone.id
    name    = join(".", [ "www", local.domain ])
    type    = "CNAME"
    ttl     = "60"

    records = [
        lower(aws_route53_record.subdomain-route-ipv4.fqdn)
    ]
}

resource "aws_acm_certificate" "certificate" {
    validation_method = "DNS"
    domain_name       = lower(local.fqdn)
    //    subject_alternative_names = [
    //        lower(join(".", [ "www", local.fqdn ]))
    //    ]
}

resource "aws_route53_record" "certificate-validations" {
    provider = aws.Production

    for_each = {
    for dvo in aws_acm_certificate.certificate.domain_validation_options : dvo.domain_name => {
        name   = dvo.resource_record_name
        record = dvo.resource_record_value
        type   = dvo.resource_record_type
    }
    }

    allow_overwrite = true
    name            = each.value[ "name" ]
    records         = [ each.value[ "record" ] ]
    ttl             = 60
    type            = each.value[ "type" ]
    zone_id         = data.aws_route53_zone.zone.zone_id
}

resource "aws_acm_certificate_validation" "validation" {
    certificate_arn = aws_acm_certificate.certificate.arn

    //    validation_record_fqdns = [
    //        lower(local.fqdn)
    //    ]

    timeouts {
        create = "120m"
    }
}
