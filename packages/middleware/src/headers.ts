import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import Request = HTTP.Request;
import Response = HTTP.Response;
import Callback = HTTP.Next;

const Overwrites = [
    {
        Key: "Server",
        Value: "Nexus-API"
    }
];

const Headers = (server: Application, headers = Overwrites) => {
    console.debug("[Middleware] [Headers] [Debug] Instantiating Default Header(s) ...");

    const $ = (_: Request, response: Response, callback: Callback) => {
        headers.forEach((Element) => {
            response.setHeader(Element.Key, Element.Value);
        });

        callback();
    };

    server.use($);

    /// console.debug("[Middleware] [Headers] [Debug] Enabled Custom Response Headers");
};

export { Headers };

export default Headers;
