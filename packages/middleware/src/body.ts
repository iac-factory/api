import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import Request = HTTP.Request;
import Response = HTTP.Response;
import Callback = HTTP.Next;

import { json, urlencoded } from "body-parser";

/***
 * @type {{"URL-Encoded": {Parameters: {extended: boolean, parameterLimit: number}, Module: (options?: bodyParser.OptionsUrlencoded) => createServer.NextHandleFunction}, JSON: {Parameters: {strict: boolean}, Module: (options?: bodyParser.OptionsJson) => createServer.NextHandleFunction}}}
 */
const Parsers = {
    "URL-Encoded": {
        Module: urlencoded,
        Parameters: {
            extended: true,
            parameterLimit: 1000
        }
    },
    "JSON": {
        Module: json,
        Parameters: {
            strict: true
        }
    }
};

/*** Body Middleware Loader
 *
 * @param server {Application}
 *
 * @param parsers {Parsers}
 *
 * @return {Application}
 *
 * @constructor
 *
 */

export const Body = (server: Application, parsers = Parsers) => {
    console.debug( "[Middleware] [Body-Parser] [Debug] Initializing Body Parser(s) ..." );

    for (const [parser, module] of Object.entries(Parsers)) {
        console.debug( "[Middleware] [Body-Parser] [Debug] Adding" + " " + parser + " " + "Module ..." );

        const { Module } = module;
        const { Parameters } = module;

        server.use(Module(Parameters));
    }

    /// console.debug( "[Middleware] [Body-Parser] [Debug] Overwrote Application Request + Response Parser(s)" );

    return server;
};

export default Body;
