/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import Utility from "util";

import API, { Router } from "express";

import type { V31 } from "@iac-factory/api-schema";

// import FS from "fs";
// import HTTPs from "https";
// import Path from "path";
// const Location = Path.join( __dirname, "open-api-specification.json" );
// FS.existsSync( Location ) || ( async () => {
//     const schema = await new Promise( (resolve) => {
//         HTTPs.get( "https://spec.openapis.org/oas/3.1/schema/2022-02-27", (response) => {
//             const data = { buffer: Buffer.alloc( 0 ) };
//             response.on( "data", (buffer) => {
//                 data.buffer += buffer;
//             } );
//
//             response.on("end", () => {
//                 resolve(data.buffer);
//             });
//         } );
//     } );
//
//     if ( typeof schema === "string" ) {
//         FS.writeFileSync( Location, JSON.stringify( JSON.parse( schema ), null, 4 ) );
//     }
// } )();

export type Route = API.IRouter & { documentation?: object | string };

type Options = { strict: boolean; casing: boolean; merge: boolean };
export type Reflection = (name: string, options?: Options) => Router & Register;

export const Global = Reflect.construct( Object, [] );

Global.routes = [];

export type Register = { registry: { symbol: Symbol }, update: (data: V31.PathsObject, debug?: boolean) => Router & { schema?: V31.PathsObject, path: string } };

Reflect.set( API, "Reflection", (name: string, options?: { strict: boolean; casing: boolean; merge: boolean }) => {
    if ( Global[ name ] ) throw new Error( "Global-Namespace-Clash-Exception" );

    const symbol = Symbol.for( name );

    Global[ name ] = symbol;

    const Instance: typeof Router = Reflect.get( API, "Router" );
    const instance = Instance( {
        strict: options?.strict ?? false,
        caseSensitive: options?.casing ?? false,
        mergeParams: options?.merge ?? true
    } );

    Reflect.set( instance, "registry", { symbol } );
    Reflect.set( instance, "update", function <Generic = typeof Router>(this: Router & { schema: V31.PathsObject, path: string }, data?: V31.PathsObject, debug?: boolean) {
        if ( this instanceof Router && data ) {
            this.schema = data;
            this.path = Object.keys(data).pop() as string;

            const output = Utility.inspect(this.schema, { depth: Infinity, colors: true });

            (debug) && console.log(output);
        }

        return this;
    } );

    // Reflect.set( instance, "path", function <Generic = typeof Router>(this: Router) {
    //     return ( this instanceof Router ) ? this.stack[ 0 ].route.path : null;
    // } );

    const mutator = Reflect.get( instance, "update" );

    mutator() && Global.routes.push( instance );

    return instance;
} );

export const Controller: Reflection = Reflect.get( API, "Reflection" );

export const Application = API();

export type Server = typeof Application;

export default Application;

export * from "./src";

