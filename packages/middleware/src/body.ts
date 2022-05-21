import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    namespace: [ "Middleware", "yellow" ],
    module: [ "Body-Parser", "green" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

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
 *
 * @return {Application}
 *
 * @constructor
 *
 */

export const Body = (server: Application) => {
    Logger.debug( "Initializing Body Parser(s) ..." );

    for (const [parser, module] of Object.entries(Parsers)) {
        Logger.debug( "Adding Module" + " " + parser + " " + "...", parser);

        const { Module } = module;
        const { Parameters } = module;

        server.use(Module(Parameters)! as HTTP.API.Handlers.Next & HTTP.API.Handlers.Pathing);
    }

    /// console.debug( "[Middleware] [Body-Parser] [Debug] Overwrote Application Request + Response Parser(s)" );

    return server;
};

export default Body;
