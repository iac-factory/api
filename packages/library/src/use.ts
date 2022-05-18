/**
 * Use the given middleware function, with optional path, defaulting to "/".
 *
 * Use (like `.all`) will run for any http METHOD, but it will not add
 * handlers for those methods so OPTIONS requests will not consider `.use`
 * functions even if they could respond.
 *
 * The other difference is that _route_ path is stripped and not visible
 * to the handler function. The main effect of this feature is that mounted
 * handlers can operate without any code changes regardless of the "prefix"
 * pathname.
 *
 * @public
 */

import { Flatten } from ".";
import { Router } from ".";
import { Layer } from ".";

export const Use = Router.prototype.use = function use(handler: string | Function) {
    let offset = 0;
    let path = "/";

    // default path to '/'
    // disambiguate router.use([handler])
    if ( typeof handler !== "function" ) {
        let arg = handler;

        while ( Array.isArray( arg ) && arg.length !== 0 ) {
            arg = arg[ 0 ];
        }

        // first arg is the path
        if ( typeof arg !== "function" ) {
            offset = 1;
            path = handler;
        }
    }

    const callbacks = Flatten( Array.prototype.slice.call( arguments, offset ) );

    if ( callbacks.length === 0 ) {
        throw new TypeError( "argument handler is required" );
    }

    for ( let i = 0; i < callbacks.length; i++ ) {
        const fn = callbacks[ i ];

        if ( typeof fn !== "function" ) {
            throw new TypeError( "argument handler must be a function" );
        }

        const layer = new Layer( path, {
            sensitive: this.caseSensitive,
            strict: false,
            end: false
        }, fn );

        layer.route = undefined;

        this.stack.push( layer );
    }

    return this;
};

export default Use;