/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Controller } from "@iac-factory/api-services";

export const Router = Controller( "IaC.Factory.API.Utility.Health.Document-DB" );
Router.get( "/utility/health/document-db", async (request, response) => {
    const { User } = await import("@iac-factory/api-database");

    const connection = await User.db.getClient().connect();

    console.log( connection );

    response.status( 200 ).send( {
        status: ( connection )
            ? "Online"
            : "Offline"
    } );
} );

export default Router;
