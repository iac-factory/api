import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import Request = HTTP.Request;
import Response = HTTP.Response;
import Callback = HTTP.Next;

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
    console.debug("[Middleware] [CORS] [Debug] Setting CORS Policy ...");

    const Middleware = CORs(Options);

    server.use(Middleware as object as HTTP.API.Handlers.Next & HTTP.API.Handlers.Pathing);

    /// console.debug("[Middleware] [CORS] [Debug] Updated & Enabled CORS");

    return server;
};

export default CORS;
