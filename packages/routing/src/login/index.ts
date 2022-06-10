/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { JWT } from "@iac-factory/api-services";

import Schema, { Router } from "./definition";

Router.post( Schema.path, async (request, response) => {
    const { authorization } = request.headers;

    const basic = ( authorization ) ? authorization.split( " " ).pop() : null;

    const credentials = ( basic ) ? Buffer.from( basic, "base64" ).toString( "utf-8" ).split( ":" ) : null;

    const { username } = ( credentials ) ? { username: credentials[ 0 ] } : request.body ?? { username: null };
    const { password } = ( credentials ) ? { password: credentials[ 1 ] } : request.body ?? { password: null };

    const error = ( !username || !password );

    const server = request.protocol + "://" + request.hostname;
    return ( !error ) ? await JWT( request.get( "origin" ) ?? server, response, username, password )
        : response.status( 401 ).send( {
            Error: "Username + Password Required"
        } );
} );

export default Router;
