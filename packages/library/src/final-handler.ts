const fs = require( "fs" );
var parseUrl = require( "parseurl" );
var statuses = require( "statuses" );


var ENCODE_CHARS_REGEXP = /(?:[^\x21\x25\x26-\x3B\x3D\x3F-\x5B\x5D\x5F\x61-\x7A\x7E]|%(?:[^0-9A-Fa-f]|[0-9A-Fa-f][^0-9A-Fa-f]|$))+/g;

/**
 * RegExp to match unmatched surrogate pair.
 * @private
 */

var UNMATCHED_SURROGATE_PAIR_REGEXP = /(^|[^\uD800-\uDBFF])[\uDC00-\uDFFF]|[\uD800-\uDBFF]([^\uDC00-\uDFFF]|$)/g;

/**
 * String to replace unmatched surrogate pair with.
 * @private
 */

var UNMATCHED_SURROGATE_PAIR_REPLACE = "$1\uFFFD$2";

/**
 * Encode a URL to a percent-encoded form, excluding already-encoded sequences.
 *
 * This function will take an already-encoded URL and encode all the non-URL
 * code points. This function will not encode the "%" character unless it is
 * not part of a valid sequence (`%20` will be left as-is, but `%foo` will
 * be encoded as `%25foo`).
 *
 * This encode is meant to be "safe" and does not throw errors. It will try as
 * hard as it can to properly encode the given URL, including replacing any raw,
 * unpaired surrogate pairs with the Unicode replacement character prior to
 * encoding.
 *
 * @param {string} url
 * @return {string}
 * @public
 */

function encodeUrl(url: string) {
    return String( url )
        .replace( UNMATCHED_SURROGATE_PAIR_REGEXP, UNMATCHED_SURROGATE_PAIR_REPLACE )
        .replace( ENCODE_CHARS_REGEXP, encodeURI );
}


var matchHtmlRegExp = /["'&<>]/;

/**
 * Escape special characters in the given string of html.
 *
 * @param  {string} string The string to escape for inserting into HTML
 * @return {string}
 * @public
 */

function escapeHtml(string: string) {
    var str = "" + string;
    var match = matchHtmlRegExp.exec( str );

    if ( !match ) {
        return str;
    }

    var escape;
    var html = "";
    var index = 0;
    var lastIndex = 0;

    for ( index = match.index; index < str.length; index++ ) {
        switch ( str.charCodeAt( index ) ) {
            case 34: // "
                escape = "&quot;";
                break;
            case 38: // &
                escape = "&amp;";
                break;
            case 39: // '
                escape = "&#39;";
                break;
            case 60: // <
                escape = "&lt;";
                break;
            case 62: // >
                escape = "&gt;";
                break;
            default:
                continue;
        }

        if ( lastIndex !== index ) {
            html += str.substring( lastIndex, index );
        }

        lastIndex = index + 1;
        html += escape;
    }

    return lastIndex !== index
        ? html + str.substring( lastIndex, index )
        : html;
}

export function flatten(list: any[], depth?: number) {
    depth = ( typeof depth == "number" ) ? depth : Infinity;

    if ( !depth ) {
        if ( Array.isArray( list ) ) {
            return list.map( function (i) { return i; } );
        }
        return list;
    }

    return _flatten( list, 1 );

    /// @ts-ignore
    function _flatten(list: any[], d: number) {
        return list.reduce( function (acc, item) {
            /// @ts-ignore
            if ( Array.isArray( item ) && d < depth ) {
                return acc.concat( _flatten( item, d + 1 ) );
            } else {
                return acc.concat( item );
            }
        }, [] );
    }
}

const Expression = {
    Space: new RegExp( "\\x20{2}", "g" ),
    Newline: new RegExp( "\\n", "g" )
};

var defer = typeof setImmediate === "function"
    ? setImmediate
    // @ts-ignore
    : function (fn) { process.nextTick( fn.bind.apply( fn, arguments ) ); };


/**
 * Create a minimal HTML document.
 *
 * @param {string} message
 * @private
 */

// @ts-ignore
function createHtmlDocument(message) {
    var body = escapeHtml( message )
        .replace( Expression.Newline, "<br>" )
        .replace( Expression.Space, " &nbsp;" );

    return "<!DOCTYPE html>\n" +
        "<html lang=\"en\">\n" +
        "<head>\n" +
        "<meta charset=\"utf-8\">\n" +
        "<title>Error</title>\n" +
        "</head>\n" +
        "<body>\n" +
        "<pre>" + body + "</pre>\n" +
        "</body>\n" +
        "</html>\n";
}

/**
 * Create a function to handle the final response.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Object} [options]
 * @return {Function}
 * @public
 */

// @ts-ignore
export async function finalhandler(req, res, options) {
    var opts = options || {};

    // get environment
    // @ts-ignore
    var env = opts.env || process.env.NODE_ENV || "development";

    // get error callback
    var onerror = opts.onerror;

    // @ts-ignore
    return function (err) {
        var headers;
        var msg;
        var status;

        // ignore 404 on in-flight response
        if ( !err && headersSent( res ) ) {
            return;
        }

        // unhandled error
        if ( err ) {
            // respect status code from error
            status = getErrorStatusCode( err );

            if ( status === undefined ) {
                // fallback to status code on response
                status = getResponseStatusCode( res );
            } else {
                // respect headers from error
                headers = getErrorHeaders( err );
            }

            // get error message
            msg = getErrorMessage( err, status, env );
        } else {
            // not found
            status = 404;
            msg = "Cannot " + req.method + " " + encodeUrl( getResourceName( req ) );
        }

        // schedule onerror callback
        if ( err && onerror ) {
            // @ts-ignore
            defer( onerror, err, req, res );
        }

        // cannot actually respond
        if ( headersSent( res ) ) {
            req.socket.destroy();
            return;
        }

        // send response
        void send( req, res, status, headers, msg );
    };
}

/**
 * Get headers from Error object.
 *
 * @param {Error} err
 * @return {object}
 * @private
 */

// @ts-ignore
function getErrorHeaders(err) {
    if ( !err.headers || typeof err.headers !== "object" ) {
        return undefined;
    }

    var headers = Object.create( null );
    var keys = Object.keys( err.headers );

    for ( var i = 0; i < keys.length; i++ ) {
        var key = keys[ i ];

        // @ts-ignore
        headers[ key ] = err.headers[ key ];
    }

    return headers;
}

/**
 * Get message from Error object, fallback to status message.
 *
 * @param {Error} err
 * @param {number} status
 * @param {string} env
 * @return {string}
 * @private
 */

// @ts-ignore
function getErrorMessage(err, status, env) {
    var msg;

    if ( env !== "production" ) {
        // use err.stack, which typically includes err.message
        msg = err.stack;

        // fallback to err.toString() when possible
        if ( !msg && typeof err.toString === "function" ) {
            msg = err.toString();
        }
    }

    return msg || statuses.message[ status ];
}

/**
 * Get status code from Error object.
 *
 * @param {Error} err
 * @return {number}
 * @private
 */

// @ts-ignore
function getErrorStatusCode(err) {
    // check err.status
    if ( typeof err.status === "number" && err.status >= 400 && err.status < 600 ) {
        return err.status;
    }

    // check err.statusCode
    if ( typeof err.statusCode === "number" && err.statusCode >= 400 && err.statusCode < 600 ) {
        return err.statusCode;
    }

    return undefined;
}

/**
 * Get resource name for the request.
 *
 * This is typically just the original pathname of the request
 * but will fallback to "resource" is that cannot be determined.
 *
 * @param {IncomingMessage} req
 * @return {string}
 * @private
 */

// @ts-ignore
function getResourceName(req) {
    try {
        return parseUrl.original( req ).pathname;
    } catch ( e ) {
        return "resource";
    }
}

/**
 * Get status code from response.
 *
 * @param {OutgoingMessage} res
 * @return {number}
 * @private
 */

// @ts-ignore
function getResponseStatusCode(res) {
    var status = res.statusCode;

    // default status code to 500 if outside valid range
    if ( typeof status !== "number" || status < 400 || status > 599 ) {
        status = 500;
    }

    return status;
}

/**
 * Determine if the response headers have been sent.
 *
 * @param {object} res
 * @returns {boolean}
 * @private
 */

// @ts-ignore
function headersSent(res) {
    return typeof res.headersSent !== "boolean"
        ? Boolean( res._header )
        : res.headersSent;
}

/**
 * Send response.
 *
 * @param {IncomingMessage} req
 * @param {OutgoingMessage} res
 * @param {number} status
 * @param {object} headers
 * @param {string} message
 * @private
 */

// @ts-ignore
function send(req: import("http2").Http2ServerRequest, res, status, headers, message) {
    function write() {
        // response body
        var body = createHtmlDocument( message );

        // response status
        res.statusCode = status;
        /// not supported for http2.0
        /// res.statusMessage = statuses.message[ status ];

        // remove any content headers
        res.removeHeader( "Content-Encoding" );
        res.removeHeader( "Content-Language" );
        res.removeHeader( "Content-Range" );

        // response headers
        setHeaders( res, headers );

        // security headers
        res.setHeader( "Content-Security-Policy", "default-src 'none'" );
        res.setHeader( "X-Content-Type-Options", "nosniff" );

        // standard headers
        res.setHeader( "Content-Type", "text/html; charset=utf-8" );
        res.setHeader( "Content-Length", Buffer.byteLength( body, "utf8" ) );

        if ( req.method === "HEAD" ) {
            res.end();
            return;
        }

        res.end( body, "utf8" );
    }

    /// detach
    req.unpipe( req.stream );

    // flush the request
    return new Promise( (resolve) => ( req.stream.id ) ?
        fs.fdatasync( req.stream.id, resolve )
        : resolve ).then( () => {
            req.resume();
        }
    );
}

/**
 * Set response headers from an object.
 *
 * @param {OutgoingMessage} res
 * @param {object} headers
 * @private
 */

// @ts-ignore
function setHeaders(res, headers) {
    if ( !headers ) {
        return;
    }

    var keys = Object.keys( headers );
    for ( var i = 0; i < keys.length; i++ ) {
        var key = keys[ i ];
        // @ts-ignore
        res.setHeader( key, headers[ key ] );
    }
}

export default finalhandler;