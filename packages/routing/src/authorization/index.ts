/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Validation } from "@iac-factory/api-services";

import Schema, { Router } from "./definition";

Router.post( Schema.path, async (request, response) => {
    const data = await Validation( request.body.jwt, request.ip );

    (data) && response.status(200).send(data);
    (data) || response.status(401).send();
} );

export default Router;
