/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { HTTP } from "@iac-factory/api-schema";

import { Debugger } from "@iac-factory/api-core";
import Request = HTTP.Request;
import Response = HTTP.Response;

/*** @experimental */
const Log = Debugger.hydrate( {
    module: [ "Body-Parser", "magenta" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

/***
 * A Abstract Logger meant only for Logging Request Data -- ***Not (Accurate) Response Data***
 *
 * The following logger is used for logging according to a common pattern, but
 * only when logging should be performed somewhere early in the client-response-write
 * chain. See {@link Logging} for {@link Response} Logging
 *
 * @param {Request} request
 * @param {any} response
 * @param {string} message
 * @returns {string}
 *
 * @constructor
 *
 */

export const Logger = (request: HTTP.Request, response: Response, message: HTTP.Message): string => {
    const Bracket = ($: string) => "[" + $ + "]";
    const Parentheses = ($: string) => "(" + $ + ")";

    const Application = Bracket( "API" );
    const Method = Bracket( request.method );
    const Status = Parentheses( ( response.statusCode === -1 ) ? "N/A" : String( response.statusCode ) );

    const Time = new Date();

    const Stamp = Parentheses( [
            Time.getMonth(),
            Time.getDay(),
            Time.getFullYear()
        ].join( "-" )
    );

    const Micro = Parentheses( [
            Time.getHours(),
            Time.getMinutes(),
            Time.getSeconds()
        ].join( "-" )
    );

    return [
        [ Application ].join( " " ), [ Stamp, Micro ].join( " " ), [ Status, Method ].join( " " ), message
    ].join( "\t" );
};

export default Logger;
