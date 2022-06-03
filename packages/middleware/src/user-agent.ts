/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

/*** Useragent */

import type { Application } from "express";

import type { Request, Response, NextFunction } from "express-serve-static-core";
import { Debugger } from "@iac-factory/api-core";

type Callback = NextFunction;

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "User-Agent", "magenta" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

/***
 * User-Agent Middleware Function
 *
 * @param {Request} request
 * @param {Response} response
 * @param {Callback} callback
 *
 * @constructor
 *
 */

const UA = (request: Request, response: Response, callback: Callback) => {
    Reflect.set( response.locals, "user-agent", request.get( "User-Agent" ) );

    callback();
};

/*** User-Agent Middleware Loader
 *
 * @param server {Application}
 *
 * @return {Application}
 *
 * @constructor
 *
 */

const Agent = (server: Application) => {
    Logger.debug( "Establishing User-Agent Capture ..." );

    server.use( UA );

    return server;
};

export { Agent };

export default Agent;
