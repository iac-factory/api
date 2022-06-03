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
const Log = Debugger.hydrate( {
    module: [ "Timestamp", "magenta" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

/***
 * Middleware that establishes a timestamp on the Response object
 *
 * Specifically,
 *
 * > A Number representing the milliseconds elapsed since the UNIX epoch.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now `Date.now()`}
 *
 * @param {Server} server
 * @constructor
 *
 */
const Timestamp = (server: Application) => {
    Log.debug( "Setting Response Timestamp ..." );

    server.use( async (request, response, callback) => {
        /// Unix Timestamp (C-Time)
        response.locals[ "X-Time-Initial" ] = new Date().getTime();
        Log.debug( "Set Timestamp (Pre-Flight)" );

        response.on( "close", () => {
            const initial = response.locals[ "X-Time-Initial" ];

            const delta = ( new Date().getTime() - initial ) / 1000;

            Log.debug( "HTTP Response Duration" + ":" + " " + delta + " " + "Second(s)" );
        } );

        void callback();
    } );
};

export default { Timestamp };

export { Timestamp };
