/*** CORs */

/*** Default CORS Options
 * @type {{credentials: boolean, origin: string, optionsSuccessStatus: number, preflightContinue: boolean}}
 */

import CORs from "cors";

export const Options = {
    origin: "*",
    credentials: false,
    optionsSuccessStatus: 200,
    preflightContinue: true
};

import type { Application } from "express";

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
    console.debug("[Middleware] [CORS] [Debug] Setting CORS Policy ...");

    const Middleware = CORs(Options);

    server.use(Middleware);

    console.debug("[Middleware] [CORS] [Debug] Updated & Enabled CORS");

    return server;
};

export default CORS;
