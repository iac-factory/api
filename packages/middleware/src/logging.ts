/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { HTTP } from "@iac-factory/api-schema";
import Application = HTTP.Application;

import Request = HTTP.Request;

/// @todo Lift up request number and put it into the Middleware's `index.js` File for Cross Usage in `log.js`, too
const $ = {
    requests: 0
};

const Logger = (request: Request, response: HTTP.Response, message: string, level: string = "log", type: string = "request") => {
    const Bracket = ($: string) => "[" + $ + "]";
    const Parentheses = ($: string) => "(" + $ + ")";

    const Application = Bracket( "API" );
    const Method = Bracket( request.method );
    const Status = Parentheses( ( response.statusCode === -1 ) ? "N/A" : String( response.statusCode ) );
    const Count = Parentheses( String( $.requests ) );
    const Level = Bracket( level );
    const Type = Bracket( type );

    const Time = new Date();

    const Modules = request.path.split( "/" ).map( ($) => Bracket( $ ) ).join( " " );

    const Stamp = Parentheses( [
        Time.getMonth(),
        Time.getDay(),
        Time.getFullYear()
    ].join( "-" ) );

    const Micro = Parentheses( [
            Time.getHours(),
            Time.getMinutes(),
            Time.getSeconds()
        ].join( "-" )
    );

    return [
        [ Application, Modules, Count ].join( " " ), [ Stamp, Micro ].join( " " ), [ Level, Type, Status, Method ].join( " " ), message
    ].join( "\t" );
};

const Logging = (server: Application) => {
    console.debug( "[Middleware] [Logging] [Debug] Instantiating HTTP Logger ..." );

    server.use( async (request, response, callback) => {
        $.requests += 1;

        process.stdout.write( Logger( request as object as Request, response, "Endpoint" + ":" + " " + String( request.path ) ) + "\n" );
        process.stdout.write( Logger( request as object as Request, response, "Secure" + ":" + " " + String( request.secure ) ) + "\n" );
        process.stdout.write( Logger( request as object as Request, response, "XHR" + ":" + " " + String( request.xhr ) ) + "\n" );

        ( request.query && JSON.stringify( request.params ) !== "{}" ) && process.stdout.write( Logger( request as object as Request, response, "Query" + ":" + " " + JSON.stringify( request.query, null, 4 ) ) + "\n" );
        ( request.params && JSON.stringify( request.params ) !== "{}" ) && process.stdout.write( Logger( request as object as Request, response, "Parameters" + ":" + " " + JSON.stringify( request.params, null, 4 ) ) + "\n" );
        ( request.headers && JSON.stringify( request.headers ) !== "{}" ) && process.stdout.write( Logger( request as object as Request, response, "Headers" + ":" + " " + JSON.stringify( request.headers, null, 4 ) ) + "\n" );

        /// ( request.body && JSON.stringify( request.body ) !== "{}" ) && process.stdout.write( Logger( request, response, "Body" + ":" + " " + JSON.stringify( request.body, null, 4 ) ) + "\n" );

        process.stdout.write( "\n" );

        callback();
    } );

    console.debug( "[Middleware] [Logging] [Debug] Enabled Custom HTTP Logging" );
};

export default { Logging };

export { Logging };
