module "default-tags" {
    source = "../default-tags"

    profile     = var.profile
    application = var.application
    service     = var.service
}
