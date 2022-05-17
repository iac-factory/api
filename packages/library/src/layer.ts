import { pathToRegexp } from "path-to-regexp";

/**
 * Module variables.
 * @private
 */

var hasOwnProperty = Object.prototype.hasOwnProperty;

export module HTTP {
    export type Request = import("express").Request;
    export type Response = import("express").Response;
    export type Next = import("express").NextFunction;
    export type Error = import("express").Errback;
}

// @ts-ignore
export function Layer(path, options, fn) {
    // @ts-ignore
    if ( !( this instanceof Layer ) ) {
        // @ts-ignore
        return new Layer( path, options, fn );
    }

    // @ts-ignore
    var opts = options || {};

    // @ts-ignore
    this.handle = fn;
    // @ts-ignore
    this.name = fn.name || "<anonymous>";
    // @ts-ignore
    this.params = undefined;
    // @ts-ignore
    this.path = undefined;
    // @ts-ignore
    this.regexp = pathToRegexp( path, this.keys = [], opts );

    // set fast path flags\
    // @ts-ignore
    this.regexp.fast_star = path === "*";
    // @ts-ignore
    this.regexp.fast_slash = path === "/" && opts.end === false;
}

/**
 * Handle the error for the layer.
 *
 * @param {Error} error
 * @param {Request} req
 * @param {Response} res
 * @param {function} next
 * @api private
 */

Layer.prototype.handle_error = function handle_error(error: HTTP.Error, req: HTTP.Request, res: HTTP.Response, next: HTTP.Next) {
    var fn = this.handle;

    if ( fn.length !== 4 ) {
        // not a standard error handler
        return next( error );
    }

    try {
        fn( error, req, res, next );
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

Layer.prototype.handle_request = function handle(req: HTTP.Request, res: HTTP.Response, next: HTTP.Next) {
    var fn = this.handle;

    if ( fn.length > 3 ) {
        // not a standard request handler
        return next();
    }

    try {
        fn( req, res, next );
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
    var match;

    if ( path != null ) {
        // fast path non-ending match for / (any path matches)
        if ( this.regexp.fast_slash ) {
            this.params = {};
            this.path = "";
            return true;
        }

        // fast path for * (everything matched in a param)
        if ( this.regexp.fast_star ) {
            this.params = { 0: decode_param( path ) };
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
    var keys = this.keys;
    var params = this.params;

    for ( var i = 1; i < match.length; i++ ) {
        var key = keys[ i - 1 ];
        var prop = key.name;
        var val = decode_param( match[ i ] );

        if ( val !== undefined || !( hasOwnProperty.call( params, prop ) ) ) {
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

function decode_param(value: string) {
    if ( typeof value !== "string" || value.length === 0 ) {
        return value;
    }

    try {
        return decodeURIComponent( value );
    } catch ( err ) {
        if ( err instanceof URIError ) {
            err.message = "Failed to decode param '" + value + "'";

            /// @ts-ignore
            err.status = 400;
        }

        throw err;
    }
}

export default Layer;