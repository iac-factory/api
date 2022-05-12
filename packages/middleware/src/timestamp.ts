import type { Request, Response, NextFunction } from "express-serve-static-core";
import type { Application } from "express";

import { Logger } from "./log";

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
const Timestamp = ( server: Application ) => {
    console.debug( "[Middleware] [Timestamp] [Debug] Initializing Response Timestamp ..." );

    server.use( async ( request: Request, response: Response, callback: NextFunction ) => {
        /// Unix Timestamp (C-Time)
        Reflect.set(response, "x-time-initial", Date.now());

        response.on("close", () => {

            Reflect.set(response, "x-time-final", Date.now());
        });

        process.stdout.write( Logger( request, response, "Timestamp" + ":" + " " + Reflect.get(response, "timestamp") + "\n" ));

        callback();
    } );

    console.debug( "[Middleware] [Timestamp] [Debug] Established Timestamp Middleware" );
};

export default { Timestamp };

export { Timestamp };
