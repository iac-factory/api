import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    namespace: [ "Middleware", "yellow" ],
    module: [ "CORS", "green" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

import CORs from "cors";

export const Options = {
    origin: "*",
    credentials: false,
    optionsSuccessStatus: 200,
    preflightContinue: true
};

/*** CORS Middleware Loader
 *
 * @param server {Application}
 *
 * @param options {Options}
 *
 * @return {Application}
 *
 * @constructor
 *
 */

export const CORS = (server: Application) => {
    Logger.debug("Setting CORS Policy ...");

    const Middleware = CORs(Options);

    server.use(Middleware as object as HTTP.API.Handlers.Next & HTTP.API.Handlers.Pathing);

    /// console.debug("[Middleware] [CORS] [Debug] Updated & Enabled CORS");

    return server;
};

export default CORS;
