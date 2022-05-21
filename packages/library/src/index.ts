import { HTTP } from "./http";
import { Layer } from "./layer";
import { Route } from "./route";
import { Methods } from "./methods";

import("./module");

/***
 *
 * @param {Options} options
 * @returns {Function}
 * @constructor
 */
export function Router(this: Construct, options?: Options): Function {
    console.debug("[Debug] Constructing Router ...");

    if ( !( ( this as object ) instanceof Router ) ) {
        return Reflect.construct( Router, [ options ] );
    }

    const defaults: Options = {
        caseSensitive: false,
        mergeParams: true,
        strict: false
    };

    const configuration = ( options ) ? { ... defaults, ... options } : defaults;

    function router(request: HTTP.Request, response: HTTP.Response, callable: HTTP.Next) {
        const reference: { handle: Function } = router as object as { handle: Function };

        reference.handle( request, response, callable );
    }

    /*** Reasoning behind Object.setPrototypeOf is much more complicated than perhaps assumed */
    Object.setPrototypeOf( router, this );
    /// router.prototype.prototype = this;

    router.caseSensitive = configuration.caseSensitive;
    router.mergeParams = configuration.mergeParams;
    router.params = {};
    router.strict = configuration.strict;
    router.stack = [] as Construct[];

    return router;
}

/**
 * Router Proxy Prototype-based Inheritance
 * ---
 * @experimental
 */
Router.prototype = new Proxy( Function as object as Interface, {} );
Router.prototype.route = function route(path: string) {
    const route = new Route( path );

    const layer = new Layer( path, {
        sensitive: this.caseSensitive,
        strict: this[ "strict" ],
        end: true
    }, handle );

    function handle(request: HTTP.Request, response: HTTP.Response, next: HTTP.Next) {
        route.dispatch( request, response, next );
    }

    layer.route = route;

    this.stack.push( layer );
    return route;
};

Methods().concat( "all" ).forEach( (method: string) => {
    Object.assign( Router.prototype, {
        [ method ]: function (this: Construct, path: string) {
            const route = ( this && this[ "route" ] ) ? this[ "route" ]( path ) : null;

            if ( route && route[ method ] ) {
                route[ method ].apply( route, Array.prototype.slice.call( arguments, 1 ) );
            }

            return this;
        }
    } );
} );

export * from "./final-handler";
export * from "./flatten";
export * from "./handle";
export * from "./http";
export * from "./parameter";
export * from "./process";
export * from "./use";
export * from "./layer";
export * from "./route";
export * from "./methods";
export * from "./async";
export * from "./utility";

export interface Interface {
    parse: Function;
    use: Function;
    dispatch: Function;
    param: Function;
    handle: Function;
    params: any;
    stack: any;
    mergeParams: any;
    caseSensitive: boolean;
    route: any;
    strict?: boolean;
}

export type Construct = typeof Router.prototype;
export type Options = { caseSensitive: boolean; mergeParams: boolean; strict: boolean }