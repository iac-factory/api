/*** Default Headers
 * @type {[{Value: string, Key: string}, {Value: string, Key: string}]}
 */

const Overwrites = [
    {
        Key: "Server",
        Value: "Nexus-API"
    },
    {
        Key: "X-Powered-By",
        Value: "Cloud-Technology"
    }
];

import type { Application, Request, Response, NextFunction } from "express";
const Headers = (server: Application, headers = Overwrites) => {
    console.debug("[Middleware] [Headers] [Debug] Instantiating Default Header(s) ...");

    const $ = (_: Request, response: Response, callback: NextFunction) => {
        headers.forEach((Element) => {
            response.setHeader(Element.Key, Element.Value);
        });

        callback();
    };

    server.use($);

    console.debug("[Middleware] [Headers] [Debug] Enabled Custom Response Headers");

};

export { Headers };

export default Headers;
