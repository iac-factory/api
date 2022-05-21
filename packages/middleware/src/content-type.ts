import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import Request = HTTP.Request;
import Response = HTTP.Response;
import Callback = HTTP.Next;

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

    server.use( async (request: Request, response: Response, callback: Callback) => {
        response.set( "Content-Type", "Application/JSON" );

        process.stdout.write( Logger( request, response, response.get( "Content-Type" ) + "\n" ) );

        callback();
    } );

    /// console.debug( "[Middleware] [Content-Type] [Debug] Set Content-Type Middleware" );

    return server;
};

export default Set;

export { Set };
