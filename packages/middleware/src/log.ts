import type { Request } from "express";

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
 * @param {Evaluations} level
 * @param {Types} type
 * @returns {string}
 *
 * @constructor
 *
 */

const Logger = ( request: Request, response: any, message: string ) => {
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
