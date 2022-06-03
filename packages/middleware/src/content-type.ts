/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { HTTP } from "@iac-factory/api-schema";

import { Debugger } from "@iac-factory/api-core";
import Application = HTTP.Application;

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "Content-Type", "magenta" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

/***
 * Content-Type
 * ---
 *
 * `Application/JSON` Content-Type Middleware
 *
 * @constructor
 *
 */

const Set = (server: Application) => {
    Logger.debug( "Updating Header := Content-Type ..." );

    server.use( async (request, response, callback) => {
        response.set( "Content-Type", "Application/JSON" );

        /// process.stdout.write( Logger( request as object as HTTP.Request, response, response.get( "Content-Type" ) + "\n" ) );

        ( callback ) && callback();
    } );

    /// console.debug( "[Middleware] [Content-Type] [Debug] Set Content-Type Middleware" );

    return server;
};

export default Set;

export { Set };
