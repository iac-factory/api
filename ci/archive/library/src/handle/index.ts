/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Generate } from "./options";

import { Wrap } from "./wrap";
import { Merge } from "./merge";
import { Path } from "./path-name";
import { Restore } from "./restore";

import type { HTTP } from "..";
import { Match, Protocol, Router, Await } from "..";
import fs from "fs";

export const Log = (message: string) => {
    /***
     *  Non-Await'd Promise
     *  ---
     *
     *  The following Buffer Write to Standard-Output is not awaited by design; such log event(s) are unimportant,
     *  where they do not impede HTTP functional requirements.
     *
     *  <br/>
     *
     *  The system is allowed to flush output to standard-output whenever available.
     *
     *  */
    void new Promise( (resolve) => process.stdout.write( "[Debug]" + " " + message + " " + "\n", resolve ) );
};

export const Handle = Router.prototype.handle = function (request: HTTP.Request, response: HTTP.Response, callback?: HTTP.Next) {
    Log( "Evaluating Response Handler(s)" );

    callback = ( callback ) ? callback as HTTP.Next : send( request, response, 200, {}, "OK" ) as object as HTTP.Next;

    let idx = 0;
    let methods: any[];
    const protohost = Protocol( request.url ) || "";
    let removed = "";
    const self = this;
    let slashAdded = false;
    let sync = 0;
    const paramcalled = {};

    // middleware and routes
    const stack = this.stack;

    // manage inter-router variables
    const parentParams = request.params;
    const parentUrl = request.baseUrl || "";

    let done = Restore( callback, request, "baseUrl", "next", "params" );

    // setup next layer
    request.next = next;

    // for options requests, respond with a default if nothing else responds
    if ( request.method === "OPTIONS" ) {
        methods = [];

        done = Wrap( done, Generate( response, methods ) );
    }

    // setup basic req values
    request.baseUrl = parentUrl;
    request.originalUrl = request.originalUrl || request.url;

    next();

    function next(err?: Error | string) {
        let layerError = err === "route" ? null : err;

        // remove added slash
        if ( slashAdded ) {
            request.url = request.url.slice( 1 );
            slashAdded = false;
        }

        // restore altered req.url
        if ( removed.length !== 0 ) {
            request.baseUrl = parentUrl;
            request.url = protohost + removed + request.url.slice( protohost.length );
            removed = "";
        }

        // signal to exit router
        if ( layerError === "router" ) {
            Await( done, null );
            return;
        }

        // no more matching layers
        if ( stack?.length && idx >= stack?.length ) {
            Await( done, layerError );
            return;
        }

        // max sync stack
        if ( ++sync > 100 ) {
            return Await( next, err );
        }

        // get pathname of request
        const path = Path( request );

        if ( path == null ) {
            /// @ts-ignore
            done( layerError );

            /// throw Error("Invalid Path Specification" );
        }

        // find next matching layer
        let layer: any;
        let match: any;
        let route: any;

        do {
            layer = stack[ idx++ ];
            match = Match( layer, path );
            route = layer.route;

            if ( typeof match !== "boolean" ) {
                // hold on to layerError
                layerError = layerError || match;
            }

            if ( match !== true ) {
                continue;
            }

            if ( !route ) {
                // process non-route handlers normally
                continue;
            }

            if ( layerError ) {
                // routes do not match with a pending error
                match = false;
                continue;
            }

            const method = request.method;
            const has_method = route._handles_method( method );

            // build up automatic options response
            if ( !has_method && method === "OPTIONS" && methods ) {
                methods.push.apply( methods, route._methods() );
            }

            // don't even bother matching route
            if ( !has_method && method !== "HEAD" ) match = false;
        } while ( match !== true && idx < stack.length );

        // no match
        if ( match !== true ) {
            /// @ts-ignore
            return done( layerError );
        }

        // store route for dispatch on change
        if ( route ) {
            request.route = route;
        }

        // Capture one-time layer values

        request.params = self.mergeParams ? Merge( layer.params, parentParams ) : layer.params;

        const layerPath = layer.path;

        self.parse( layer, paramcalled, request, response, function (err: any) {
            if ( err ) {
                next( layerError || err );
            } else {
                if ( route ) {
                    layer.handle( request, response, next );
                } else {
                    trim( layer, layerError, layerPath, path );
                }
            }

            sync = 0;
        } );
    }

    function trim(layer: any, error: any, layerPath: any, path: any) {
        if ( layerPath.length !== 0 ) {
            // Validate path is a prefix match
            if ( layerPath !== path.substring( 0, layerPath.length ) ) {
                next( error );
                return;
            }

            // Validate path breaks on a path separator
            const c = path[ layerPath.length ];
            if ( c && c !== "/" ) {
                next( error );
                return;
            }

            removed = layerPath;
            request.url = protohost + request.url.slice( protohost.length + removed.length );

            // Ensure leading slash
            if ( !protohost && request.url[ 0 ] !== "/" ) {
                request.url = "/" + request.url;
                slashAdded = true;
            }

            // Setup base URL (no trailing slash)
            request.baseUrl = parentUrl + ( removed[ removed.length - 1 ] === "/"
                ? removed.substring( 0, removed.length - 1 )
                : removed );
        }

        ( error ) && layer.error( error, request, response, next );

        layer.handle( request, response, next );
    }
};

async function send(req: HTTP.Request, res: HTTP.Response, status: HTTP.Status, headers: HTTP.Headers, message: HTTP.Message) {
    const handler = async () => new Promise( (resolve, reject) => {
        /// If the HTTP Request is HTTP 1.1, and not HTTP 2.0
        if ( !( req.stream ) || !( req.stream.id ) ) reject();

        const identifier = req.stream.id;

        Log( "Initializing Request-End Handler" );

        req.on( "end", (error: NodeJS.ErrnoException, code: number) => {
            if ( error ) Log( "Error" + " " + JSON.stringify( { error } ) + " " + JSON.stringify( { code } ) );
        } );

        Log( "Closing Duplex HTTP Stream" );

        req.unpipe( req.stream );

        Log( "Flushing File-System Buffer(s)" );

        /***
         * Low-Level File Descriptor Metadata
         * ---
         * At a later time, provide a means for debug vs. tracing log levels to limit both output
         * and awaitable promises from getting invoked.
         *
         * @todo - Log Levels
         * @experimental
         *
         * @type {fs.Stats}
         */
        const statistics: () => Promise<fs.Stats> = async () => new Promise( (resolve) => {
            ( identifier ) && fs.fstat( identifier, { bigint: false }, (exception, data) => {
                if ( exception ) throw exception;

                resolve( data );
            } );
        } );

        return new Promise( (resolve) => {
            ( identifier ) && Log( "Verified Open File Descriptor" );
            /// ( identifier ) && Log( "File Descriptor Metadata" + ":" + JSON.stringify( { ... statistics } ) );

            ( identifier ) ? fs.fdatasync( identifier, resolve ) : resolve;
        } );
    } );

    await handler().catch( (exception) => {
        // ...
    } ).finally( () => {
        Log( "Manually Closing Stream Handler" );

        try {
            req.stream.end();
        } catch ( exception ) {}

        Log( "Submitting HTTP Response ..." );

        req.resume();
    } );
}

export * from "./options";
export * from "./wrap";
export * from "./merge";
export * from "./path-name";
export * from "./restore";

export default Handle;
