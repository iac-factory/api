import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "Body-Parser", "magenta" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

/*** Compression
 * @module Compression
 */

import Compression from "compression";

/***
 * Compression Middleware Loader
 *
 * @param server {Application}
 *
 * @returns {Application}
 *
 * @constructor
 *
 */

export const Compress = (server: Application) => {
    Logger.debug("Setting Compression Configuration(s) ...");

    server.use(Compression() as HTTP.API.Handlers.Next & HTTP.API.Handlers.Pathing);

    /// console.debug("[Middleware] [Compression] [Debug] Enabled Compression");

    return server;
};

export default Compress;
