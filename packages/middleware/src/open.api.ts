import type { Request, Response, NextFunction as Callback } from "express-serve-static-core";
import type { Application } from "express";

const Trim = (input: string) => {
    const index = input.length - 1;

    if ( input[ index ] === "/" ) {
        return input.substring( 0, index );
    } else {
        return input;
    }
};

const Integer = (str: any | string | null) => {
    if ( str === null ) {
        return false;
    } else {
        if ( typeof str !== "string" ) {
            return false;
        }
    }

    const num = Number( str );

    return Number.isInteger( num ) && num > 0;
};

/***
 *
 * @param obj {object}
 *
 * @returns {{}}
 *
 */

export const Flatten = (obj: any) => {
    const _: any = {};

    Object.keys( obj ).forEach( (key) => {
        _[ key ] = typeof obj[ key ];

        if ( typeof obj[ key ] === "object" && obj[ key ] !== null ) {
            _[ key ] = Flatten( obj[ key ] );
        } else {
            (
                obj[ key ] === null
            ) ? _[ key ] = null
                : _[ key ] = typeof obj[ key ];
        }

    } );

    return _;
};

const Type = (input: any) => {
    const container: { object: object | null; string: string | null; raw: string | null } = {
        object: null,
        string: null,
        raw: null
    };

    try {
        container.object = JSON.parse( input );
    } catch ( error ) {
        container.object = null;
        try {
            container.string = JSON.stringify( input );
        } catch ( error ) {
            container.string = null;
            container.raw = String( input );
        }
    }

    const $ = {};
    Object.keys( container ).forEach( (property) => {
        if ( Reflect.get( container, property ) !== null ) Object.assign( $, Reflect.get( container, property ) );
    } );

    return $;
};

const Deconstruct = (input: any) => {
    if ( ( typeof ( Type( input ) ) ) === "object" ) {
        try {
            return Object.entries( Flatten( JSON?.parse( input ) ) ).map( ($) => {
                return { [ $[ 0 ] ]: { type: $[ 1 ] } };
            } );
        } catch ( error ) {
            try {
                return Flatten( input );
            } catch ( error ) {
                return {};
            }
        }
    } else {
        return {};
    }
};

/**
 * Interceptor function used to monkey patch the `response.send` until it is invoked
 * at which point it intercepts the invocation; the response's `"content"` key is set to
 * the response body's content.
 *
 * @param {Response} response Original Response Object
 * @param {NextFunction} callback Original `response.send` Callable
 *
 * @returns {(content: (Object | string | number | null)) => void}
 * @constructor
 */
const Intercept = (response: Response, callback: Callback) => (content: Object | string | number | null) => {
    Reflect.set( response, "content", content );
    Reflect.set( response, "send", callback );
    response.send( content );
};

const URL = (client: Request, response: Response, callback: Callback) => {
    response.on( "finish", () => {
        const initialize = () => {
            const $: Local = {};

            interface Local<Type = Object> {
                [ $: string ]: string | number | { [ $: string ]: string | number | object | Type };
            }

            const headers = {};

            Object.assign( headers, response.getHeaders() );

            const content = Reflect.get( response, "content" );

            $[
                Trim( [ client.baseUrl, Object.keys( client.params ).map(
                    ($) => {
                        return "{" + $ + "}";
                    } ).join( "/" ) ].join( "/" ) )
                ] = {
                [ client.method.toLowerCase() ]: {
                    parameters: [
                        ... Object.entries( client.params ).map( (tuple) => {
                            return ( Integer( ( tuple[ 1 ] ) ? tuple[ 1 ] : null ) ) ? {
                                name: tuple[ 0 ],
                                in: "path",
                                required: true,
                                schema: {
                                    type: "integer"
                                }
                            } : {
                                name: tuple[ 0 ],
                                in: "path",
                                required: true,
                                schema: {
                                    type: "string"
                                }
                            };
                        } ), ... Object.entries( client.query ).map( (tuple) => {
                            return ( Integer( ( tuple[ 1 ] ) ? tuple[ 1 ] : null ) ) ? {
                                name: tuple[ 0 ],
                                in: "query",
                                schema: {
                                    type: "integer"
                                }
                            } : {
                                name: tuple[ 0 ],
                                in: "query",
                                required: false,
                                schema: {
                                    type: "string"
                                }
                            };
                        } )
                    ],
                    responses: {
                        [ String( response.statusCode ) ]: {
                            description: response.statusMessage,
                            headers: headers,
                            $ref: {
                                type: typeof ( Type( content ) ),
                                properties: Deconstruct( content )
                            }
                        }
                    },
                    summary: [
                        client.method.toUpperCase(),
                        client.originalUrl.substring( 1 )
                    ].join( " " )
                }
            };

            Object.assign( response.locals, $ );

            return response.locals;
        };

        if ( response.get( "x-open-api" ) ) {
            Reflect.set( response, "send", Intercept( response, response.send ) );

            const schema = initialize();

            console.log( "Open-API Schema" + ":", JSON.stringify( schema, null, 4 ) );
        }
    } );

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

export const $ = (server: Application) => {
    /// console.debug( "[Middleware] [CORS] [Debug] Establishing User-Agent Capture ..." );

    server.use( URL );

    /// console.debug( "[Middleware] [CORS] [Debug] Capturing User-Agent" );

    return server;
};

export default $;
