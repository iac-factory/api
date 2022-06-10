/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { HTTP } from "./http";
import { Layer } from "./layer";
import { Route } from "./route";
import { Methods } from "./methods";
import { Handle } from "./handle";

import("./module");

/***
 *
 * @param {Options} options
 * @returns {Function}
 * @constructor
 */
export function Router(this: Construct, options?: Options): Function {
    if ( !( ( this as object ) instanceof Router ) ) {
        console.debug( "[Debug] Constructing Router ..." );

        return Reflect.construct( Router, [ options ] );
    }

    const defaults: Options = {
        caseSensitive: false,
        mergeParams: true,
        strict: false
    };

    const configuration = ( options ) ? { ... defaults, ... options } : defaults;

    function router(request: HTTP.Request, response: HTTP.Response, callable: HTTP.Next) {
        // @ts-ignore
        // (router.handle) && router.handle( request, response, callable );
        // @ts-ignore
        // (router.handle) || console.log(router);

        console.log(test);

        const reference: { handle: Function } = router as object as { handle: Function };
        // @ts-ignore
        console.log(reference.stack);
        // @ts-ignore
        reference.stack[0].handle( request, response, callable );
    }

    /*** Reasoning behind Object.setPrototypeOf is much more complicated than perhaps assumed */
    Object.setPrototypeOf( router, this );

    const test = this;

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
