/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import Framework from "express";
import API, { Router } from "express";

type Options = { strict: boolean; casing: boolean; merge: boolean };
export type Reflection = (name: string, options?: Options) => Router & Register;

const Global = Reflect.construct( Object, [] );

export type Register = { registry: { symbol: Symbol } };

Reflect.set( Framework, "Reflection", (name: string, options?: { strict: boolean; casing: boolean; merge: boolean }) => {
    if ( Global[ name ] ) throw new Error( "Global-Namespace-Clash-Exception" );

    const symbol = Symbol.for( name );

    Global[ name ] = symbol;

    const Instance: typeof Router = Reflect.get( Framework, "Router" );
    const instance = Instance( {
        strict: options?.strict ?? true,
        caseSensitive: options?.casing ?? false,
        mergeParams: options?.merge ?? false
    } );

    Reflect.set( instance, "registry", { symbol } );

    return instance;
} );

export const Controller: Reflection = Reflect.get( Framework, "Reflection" );

export { Framework };

export const Application = API();

export type Server = typeof Application;

export default Application;

export * from "./src";
