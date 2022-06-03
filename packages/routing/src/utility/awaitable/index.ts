/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.Utility.Awaitable" );
Router.get( "/utility/awaitable", async (request, response) => {
    const { Awaitable } = await import("@iac-factory/api-services");

    const { duration } = request.query;

    await Awaitable( ( duration ?? "1500" ) as string ).then( (time) => {
        response.status( 200 ).send( {
            duration: time
        } );
    } );
} );

export default Router;
