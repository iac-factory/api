/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Debugger } from "@iac-factory/api-core";
import type { Application } from "express";

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "Framework", "magenta" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

const Initialize = (server: Application) => {
    Logger.debug( "Configuring API Framework ..." );

    server.init();

    server.disable( "etag" );
    server.disable( "view" );
    server.disable( "views" );
    server.disable( "x-powered-by" );

    return server;
};

export { Initialize };

export default Initialize;
