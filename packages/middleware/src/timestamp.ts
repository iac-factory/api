import { HTTP } from "@iac-factory/api-schema";

import { Debugger } from "@iac-factory/api-core";

import Application = HTTP.Application;

/*** @experimental */
const Log = Debugger.hydrate( {
    namespace: [ "Performance", "green" ],
    module: [ "Timestamp", "blue" ],
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

            Log.debug( "Timestamp (Delta)" + " " + delta + " " + "Second(s)" );
        } );

        void callback();
    } );
};

export default { Timestamp };

export { Timestamp };
