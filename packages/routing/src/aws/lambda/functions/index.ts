/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import Schema, { Router } from "./definition";

import { Directory } from "@iac-factory/api-services";

Router.get( Schema.path, async (request, response) => {
    response.status( 200 ).send( {
        Routes: [
            ... Directory(__filename)
        ]
    } );
} );

export default Router;
