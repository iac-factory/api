import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import Request = HTTP.Request;
import Response = HTTP.Response;
import Callback = HTTP.Next;

const Initialize = (server: Application) => {
    console.debug("[Middleware] [Framework] [Debug] Configuring API Framework ...");

    server.init();

    console.debug("[Middleware] [Framework] [Debug] Deconstructing ETagging Callable ...");
    server.disable("etag");

    console.debug("[Middleware] [Framework] [Debug] Disabling Static View(s) ...");
    server.disable("view");
    server.disable("views");

    console.debug("[Middleware] [Framework] [Debug] Removing X-Powered-By Header ...");
    server.disable("x-powered-by");

    return server;
};

export { Initialize };

export default Initialize;
