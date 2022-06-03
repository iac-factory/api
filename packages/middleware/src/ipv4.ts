/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import HTTPs from "https";

import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "Body-Parser", "magenta" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

const $ = function (error: string | null, address: string | null | undefined, resolve: { (value: unknown): void; (value: unknown): void; (arg0: string | undefined): any }) {
    if ( error ) return console.log( error );
    if ( address != null ) { process.env[ "ip" ] = address; }

    console.debug( "[Middleware] [Debug] [IPv4]", "Public IPv4 Address" + ":", process.env?.[ "ip" ] );

    return resolve( process.env[ "ip" ] );
};

/***
 * IP isn't so much middleware as it is just useful information that gets written to standard-output upon server initialization
 *
 * @returns {Promise<unknown>}
 * @constructor
 */

const IP = () => new Promise( (resolve) => {
    HTTPs.get( {
        host: "api.ipify.org"
    }, function (response) {
        let ip = "";

        response.on( "data", function (chunk) {
            ip += chunk;
        } );
        response.on( "end", function () {
            if ( ip ) {
                $( null, ip, resolve );
            } else {
                $( "Error: Unable to get IP Address", null, resolve );
            }
        } );
    } );
} );

export { IP };

export default { IP };
