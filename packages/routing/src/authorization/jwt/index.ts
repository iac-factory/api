/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { JWT }            from "@iac-factory/api-services";
import Schema, { Router } from "./definition";
import { Response }       from "express-serve-static-core";

Router.post( Schema.path, async (request, response) => {
    const { authorization } = request.headers;

    const basic = ( authorization ) ? authorization.split( " " ).pop() : null;

    const credentials = ( basic ) ? Buffer.from( basic, "base64" ).toString( "utf-8" ).split( ":" ) : null;

    const { username } = ( credentials ) ? { username: credentials[ 0 ] } : request.body ?? { username: null };
    const { password } = ( credentials ) ? { password: credentials[ 1 ] } : request.body ?? { password: null };

    const error = ( !username || !password );

    const server = request.protocol + "://" + request.hostname;

    const unauthorized = (response: Response<any, Record<string, any>, number> | void) => response?.status( 401 ).set( "WWW-Authenticate", "Token-Exchange" ).send( "Invalid Username & Password Combination" );

    const token = ( !error ) ? await JWT( request.get( "origin" ) ?? server, request.ip, username, password )
        : unauthorized( response );

    ( token ) && response.status( 200 ).set( "Content-Type", "Application/JWT" ).send( token );
} );

export default Router;
