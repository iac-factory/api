/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { HTTP } from "@iac-factory/api-schema";

import { Debugger } from "@iac-factory/api-core";
import type { Application } from "express";

import Request = HTTP.Request;
import Response = HTTP.Response;
import Callback = HTTP.Next;

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "Headers", "magenta" ],
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
    Logger.debug( "Instantiating Default Header(s) ..." );

    const $ = (_: Request, response: Response, callback: Callback) => {
        headers.forEach( (Element) => {

            response.set( Element.Key, Element.Value );
        } );

        Logger.debug( "Set Default Response Headers" );

        callback();
    };

    server.use( $ as HTTP.API.Handlers.Next & HTTP.API.Handlers.Pathing );

    /// console.debug("[Middleware] [Headers] [Debug] Enabled Custom Response Headers");
};

export { Headers };

export default Headers;
