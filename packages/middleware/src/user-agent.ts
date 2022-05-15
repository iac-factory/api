/*** Useragent */

import type { Application } from "express";

import type { Request } from "express-serve-static-core";
import type { Response } from "express-serve-static-core";
import type { NextFunction } from "express-serve-static-core";

type Callback = NextFunction;


/***
 * User-Agent Middleware Function
 *
 * @param {Request} request
 * @param {Response} response
 * @param {Callback} callback
 *
 * @constructor
 *
 */

const UA = (request: Request, response: Response, callback: Callback) => {
    Reflect.set( response.locals, "user-agent", request.get( "User-Agent" ) );

    callback();
};

/*** User-Agent Middleware Loader
 *
 * @param server {Application}
 *
 * @return {Application}
 *
 * @constructor
 *
 */

const Agent = (server: Application) => {
    console.debug( "[Middleware] [CORS] [Debug] Establishing User-Agent Capture ..." );

    server.use( UA );

    console.debug( "[Middleware] [CORS] [Debug] Capturing User-Agent" );

    return server;
};

export { Agent };

export default Agent;
