import Utility from "util";

import type { Request, Response, NextFunction } from "express-serve-static-core";
import type { Application } from "express";
import * as Events from "events";

export const Apply = (server: Application) => {
    console.debug( "[Middleware] [Winston] [Debug] Updating Logger ..." );

    server.use( (request: Request, response: Response, next: NextFunction) => {
        request.addListener("end", (event: Events.EventEmitter) => {
            process.stdout.write( Utility.inspect(
                request, {
                    colors: false,
                    compact: 12,
                    maxStringLength: 25,
                    sorted: true
                } )
            );
        });

        response.addListener("finish", (event: Events.EventEmitter) => {
            process.stdout.write( Utility.inspect(
                { Response: response }, {
                    colors: false,
                    compact: 12,
                    maxStringLength: 25,
                    sorted: true
                } )
            );
        });

        next();
    } );

    console.debug( "[Middleware] [Content-Type] [Debug] Created Winston Logger" );
};

export default Apply;
