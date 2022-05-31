import pathToRegexp from "path-to-regexp";

import { HTTP } from ".";

export interface Constructor {
    layer: any;
    keys: any[];
    regexp: RegExp & Partial<{
        fast_star: boolean;
        fast_slash: boolean;
    }>;

    path?: string;
    params?: object;
    handle?: object;
    name: any;

    route: any;

    new (path: string, options: any, fn: any): Constructor;
}

export const Layer = function (this: any, path: string, options: any, fn: any) {
    if ( !( this instanceof Layer ) ) {
        return new Layer( path, options, fn );
    }

    var opts = options || {};

    this.handle = fn;
    this.name = fn.name || "<anonymous>";
    this.params = undefined;
    this.path = undefined;
    this.regexp = pathToRegexp( path, this.keys = [], opts );

    // set fast path flags
    this.regexp.fast_star = path === "*";
    this.regexp.fast_slash = path === "/" && opts.end === false;

    return;
} as any as { new(name: string, options: {
        sensitive?: boolean;
        strict?: boolean;
        end?: boolean;
    }, fn: any): Constructor; };

/**
 * Handle the error for the layer.
 *
 * @param {Error} error
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @api private
 */

Layer.prototype.error = function (error: HTTP.Error, request: HTTP.Request, response: HTTP.Response, next: HTTP.Next) {
    var fn = this.handle;

    if ( fn.length !== 4 ) {
        // not a standard error handler
        return next( error );
    }

    try {
        fn( error, request, response, next );
    } catch ( err ) {
        next( err );
    }
};

/**
 * Handle the request for the layer.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @api private
 */

Layer.prototype.handle = function (request: HTTP.Request, response: HTTP.Response, next: HTTP.Next) {
    const fn = this.handle;

    if ( fn.length > 3 ) {
        // not a standard request handler
        return next();
    }

    try {
        fn( request, response, next );
    } catch ( err ) {
        next( err );
    }
};

/**
 * Check if this route matches `path`, if so
 * populate `.params`.
 *
 * @param {String} path
 * @return {Boolean}
 * @api private
 */

Layer.prototype.match = function match(path: string) {
    let match;

    if ( path != null ) {
        // fast path non-ending match for / (any path matches)
        if ( this.regexp.fast_slash ) {
            this.params = {};
            this.path = "";
            return true;
        }

        // fast path for * (everything matched in a param)
        if ( this.regexp.fast_star ) {
            this.params = { 0: decode( path ) };
            this.path = path;
            return true;
        }

        // match the path
        match = this.regexp.exec( path );
    }

    if ( !match ) {
        this.params = undefined;
        this.path = undefined;
        return false;
    }

    // store values
    this.params = {};
    this.path = match[ 0 ];

    // iterate matches
    const keys = this.keys;
    const params = this.params;

    for ( let i = 1; i < match.length; i++ ) {
        const key = keys[ i - 1 ];
        const prop = key.name;
        const val = decode( match[ i ] );

        if ( val !== undefined || !( Object.prototype.hasOwnProperty.call( params, prop ) ) ) {
            params[ prop ] = val;
        }
    }

    return true;
};

/**
 * Decode param value.
 *
 * @param {string} val
 * @return {string}
 * @private
 */

function decode(value: string) {
    if ( typeof value !== "string" || value.length === 0 ) {
        return value;
    }

    try {
        return decodeURIComponent( value );
    } catch ( error ) {
        if ( error instanceof URIError ) {
            error.message = "Failed to decode param '" + value + "'";

            Reflect.set( error, "status", 400 );
        }

        throw error;
    }
}

export default Layer;
