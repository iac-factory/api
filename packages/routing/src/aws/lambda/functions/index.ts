/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.AWS.Lambda.Functions" );
Router.get( "/aws/lambda/functions", async (request, response) => {
    const { Lambda } = await import("@iac-factory/api-services");
    const { Functions } = Lambda.Client;

    response.status( 200 ).send( {
        Functions: await Functions()
    } );
} );

export default Router;
