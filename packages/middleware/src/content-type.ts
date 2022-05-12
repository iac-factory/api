import type { Request, Response, NextFunction } from "express-serve-static-core";
import type { Application } from "express";

import { Logger } from "./log";

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
    console.debug( "[Middleware] [Content-Type] [Debug] Updating Content-Type ..." );

    server.use( async (request: Request, response: Response, callback: NextFunction) => {
        response.set( "Content-Type", "Application/JSON" );

        process.stdout.write( Logger( request, response, response.get( "Content-Type" ) + "\n" ) );

        callback();
    } );

    console.debug( "[Middleware] [Content-Type] [Debug] Set Content-Type Middleware" );
};

export default Set;

export { Set };
