/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import Schema, { Router } from "./definition";
Router.get( Schema.path, async (request, response) => {
    const { Lambda } = await import("@iac-factory/api-services");

    const { Functions } = Lambda.Client;

    response.status( 200 ).send( {
        Functions: (await Functions())?.map((lambda) => lambda)
    } );
} );

export default Router;
