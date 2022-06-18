/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import type { Request, Response, NextFunction } from "express-serve-static-core";
import type { Application } from "express";

import { Logger } from "./log";
import { HTTP } from "@iac-factory/api-schema";

import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Log = Debugger.hydrate( {
    module: [ "Body-Parser", "magenta" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

/***
 * Middleware that overwrites the default `response` object's statusCode early on in the client-response `callback()`
 *
 * Please note that it's imperative for the following middleware to be explicitly established as one of the first
 * (if not always the first) middleware(s) in the client-response-write chain.
 *
 * Implementation of the following middleware additionally forces consumers to produce their own
 * HTTP status-code; there are arguments for and against such a side-effect, but it's elected
 * as a means for better logging in the current context.
 *
 * Specifically, the Status-Code gets initialized to **100 Continue**:
 *
 * > ### 100 Continue ###
 * > *This interim response indicates that the client should continue the request or ignore the response if the request is already finished.*
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/100 100 Continue} for more information
 *
 * Lastly, please note that this is not a 100% compliant **100 Continue** implementation; it's simply a partially
 * compliant means for useful interim server-internal logging.
 *
 * @param {Server} server
 * @constructor
 *
 */
const Status = (server: Application) => {
    console.debug( "[Middleware] [Status-Code] [Debug] Overwriting Default Status-Code Middleware ..." );

    const message = (response: Response) => {
        const code = response.statusCode;

        if ( code === 100 ) return " " + "100 Continue" + "\n";

        return " " + response.statusMessage + "\n";
    };

    server.use( async (request: Request, response: Response, callback: NextFunction) => {
        /// response.status( 100 );

        /// Unix Timestamp (C-Time)
        Reflect.set( response, "time", Date.now() );

        process.stdout.write( Logger( request as object as HTTP.Request, response as HTTP.Response, "Partial-Status" + ":" + message( response ) ) );

        callback();
    } );

    console.debug( "[Middleware] [Status-Code] [Debug] Updated Default Status-Code" );
};

export default { Status };

export { Status };
