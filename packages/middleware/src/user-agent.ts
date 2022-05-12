/*** Useragent */

/*** Default CORS Options
 * @type {{credentials: boolean, origin: string, optionsSuccessStatus: number, preflightContinue: boolean}}
 */

import type { Request, Response, NextFunction as Callback } from "express-serve-static-core";
import type { Application } from "express";

/***
 * User-Agent Middleware Function
 *
 * @param {Request} request
 * @param {Response} response
 * @param {NextFunction} callback
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
