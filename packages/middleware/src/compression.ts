import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import Request = HTTP.Request;
import Response = HTTP.Response;
import Callback = HTTP.Next;

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
    console.debug("[Middleware] [Compression] [Debug] Setting Compression Configuration(s) ...");

    server.use(Compression());

    /// console.debug("[Middleware] [Compression] [Debug] Enabled Compression");

    return server;
};

export default Compress;
