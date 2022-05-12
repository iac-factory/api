/*** Compression
 * @module Compression
 */

import Compression from "compression";

import type { Application } from "express";

/*** Compression Middleware Loader
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
    console.debug("[Middleware] [Compression] [Debug] Enabled Compression");

    return server;
};
