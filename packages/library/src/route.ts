import { HTTP } from ".";
import { Await } from ".";
import { Flatten } from ".";

import { Layer } from "./layer";
import { Methods } from "./methods";

/**
 * Initialize `Route` with the given `path`,
 *
 * @param {String} path
 * @api private
 */

export const Route = function (this: any & object, path: string) {
    this.path = path;
    this.stack = [];
    this.methods = Object.create( null );
} as object as { new(path: string): any };

/**
 * @private
 */

Route.prototype._handles_method = function _handles_method(method: string) {
    if ( this.methods._all ) {
        return true;
    }

    // normalize name
    var name = method.toLowerCase();

    if ( name === "head" && !this.methods[ "head" ] ) {
        name = "get";
    }

    return Boolean( this.methods[ name ] );
};

/**
 * @return {array} supported HTTP methods
 * @private
 */

Route.prototype._methods = function _methods() {
    const state: { iterator: number } = { iterator: 0 };

    const methods = Object.keys( this.methods );

    // append automatic head
    if ( this.methods.get && !this.methods.head ) {
        methods.push( "head" );
    }

    const length = methods.length;
    for ( state.iterator; state.iterator < length; state.iterator++ ) {
        // make upper case
        methods[ state.iterator ] = methods[ state.iterator ]!.toUpperCase();
    }

    return methods;
};

/**
 * dispatch req, res into this route
 *
 * @private
 */

Route.prototype.dispatch = function dispatch(request: HTTP.Request, response: HTTP.Response, done: HTTP.Next) {
    var idx = 0;
    var stack = this.stack;
    var sync = 0;

    if ( stack.length === 0 ) {
        return done();
    }

    var method = request.method.toLowerCase();
    if ( method === "head" && !this.methods[ "head" ] ) {
        method = "get";
    }

    request.route = this;

    next();

    type Callable = typeof next.prototype;

    function next(this: Callable, error?: Error | "route" | "router"): void | NodeJS.Immediate {
        // signal to exit route
        if ( error && error === "route" ) {
            return done();
        }

        // signal to exit router
        if ( error && error === "router" ) {
            return done( error );
        }

        // no more matching layers
        if ( idx >= stack.length ) {
            return done( error );
        }

        // max sync stack
        if ( ++sync > 100 ) {
            // @ts-ignore
            return Await( next, error );
        }

        var layer;
        var match;

        // find next matching layer
        while ( match !== true && idx < stack.length ) {
            layer = stack[ idx++ ];
            match = !layer.method || layer.method === method;
        }

        // no match
        if ( match !== true ) {
            return done( error );
        }

        if ( error ) {
            layer.error( error, request, response, next );
        } else {
            layer.handle( request, response, next );
        }

        sync = 0;
    }
};

/**
 * Add a handler for all HTTP verbs to this route.
 *
 * Behaves just like middleware and can respond or call `next`
 * to continue processing.
 *
 * You can use multiple `.all` call to add multiple handlers.
 *
 *   function check_something(req, res, next){
 *     next()
 *   }
 *
 *   function validate_user(req, res, next){
 *     next()
 *   }
 *
 *   route
 *   .all(validate_user)
 *   .all(check_something)
 *   .get(function(req, res, next){
 *     res.send("hello world")
 *   })
 *
 * @param {array|function} handler
 * @return {Route} for chaining
 * @api public
 */

Route.prototype.all = function all(handler: any) {
    // @ts-ignore
    var callbacks = Flatten( Array.prototype.slice.call( arguments ) );

    if ( callbacks.length === 0 ) {
        throw new TypeError( "argument handler is required" );
    }

    for ( var i = 0; i < callbacks.length; i++ ) {
        var fn = callbacks[ i ];

        if ( typeof fn !== "function" ) {
            throw new TypeError( "argument handler must be a function" );
        }

        // @ts-ignore
        var layer = Layer( "/", {}, fn );

        layer.method = undefined;

        this.methods._all = true;
        this.stack.push( layer );
    }

    return this;
};

Methods().forEach( function (method) {
    Route.prototype[ method ] = function (handler: any) {
        // @ts-ignore
        var callbacks = Flatten( Array.prototype.slice.call( arguments ) );

        if ( callbacks.length === 0 ) {
            throw new TypeError( "argument handler is required" );
        }

        for ( var i = 0; i < callbacks.length; i++ ) {
            var fn = callbacks[ i ];

            if ( typeof fn !== "function" ) {
                throw new TypeError( "argument handler must be a function" );
            }

            // @ts-ignore
            var layer = Layer( "/", {}, fn );
            layer.method = method;

            this.methods[ method ] = true;
            this.stack.push( layer );
        }

        return this;
    };
} );

export default Route;