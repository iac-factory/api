import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import Request = HTTP.Request;
import Response = HTTP.Response;
import Callback = HTTP.Next;

import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    namespace: [ "Middleware", "yellow" ],
    module: [ "Response-Headers", "green" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

const Overwrites = [
    {
        Key: "Content-Type",
        Value: "Application/JSON"
    },
    {
        Key: "Server",
        Value: "Nexus-API"
    },
    {
        Key: "X-Powered-By",
        Value: "IaC-Factory"
    },
    {
        Key: "X-Open-API",
        Value: "True"
    }
];

const Headers = (server: Application, headers = Overwrites) => {
    Logger.debug("Instantiating Default Header(s) ...");

    const $ = (_: Request, response: Response, callback: Callback) => {
        headers.forEach((Element) => {
            Logger.debug("Assigning" + " " + Element.Key + " " + "to" + " " + Element.Value);

            response.set(Element.Key, Element.Value);
        });

        callback();
    };

    server.use($ as HTTP.API.Handlers.Next & HTTP.API.Handlers.Pathing);

    /// console.debug("[Middleware] [Headers] [Debug] Enabled Custom Response Headers");
};

export { Headers };

export default Headers;
