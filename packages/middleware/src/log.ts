import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import Request = HTTP.Request;
import Response = HTTP.Response;
import Callback = HTTP.Next;

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

const Logger = (request: Request, response: Response, message: HTTP.Message) => {
    const Bracket = ( $: string ) => "[" + $ + "]";
    const Parentheses = ( $: string ) => "(" + $ + ")";

    const Application = Bracket( "API" );
    const Method = Bracket( request.method );
    const Status = Parentheses( (response.statusCode === -1 ) ? "N/A" : String( response.statusCode ) );

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

export default { Logger };

export { Logger };
