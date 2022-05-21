import Framework from "express";

import API, { Router } from "express";

type Options = { strict: boolean; casing: boolean; merge: boolean };
export type Reflection = ( name: string, options?: Options ) => Router;

const Global = Reflect.construct(Object, []);

console.debug("[API-Services] [Global] [Debug]", "Initializing Global Reflection Registry ...");
Reflect.set(Framework, "Reflection", (name: string, options?: { strict: boolean; casing: boolean; merge: boolean }) => {
    if (Global[name]) throw new Error("Global-Namespace-Clash-Exception");

    console.debug("[API-Services] [Registry] [Debug]", "Adding", name, "to Global Registry ...");

    const symbol = { symbol: Symbol.for(name), name: name };

    Global[name] = symbol;

    const Instance: typeof Router = Reflect.get(Framework, "Router");
    const instance = Instance({
        strict: options?.strict ?? true,
        caseSensitive: options?.casing ?? false,
        mergeParams: options?.merge ?? false
    });

    Reflect.set(instance, "registry", symbol);

    return instance;
});

export const Controller: Reflection = Reflect.get(Framework, "Reflection");

export { Framework };

export const Application = API();

export type Server = typeof Application;

export default Application;

export * from "./src";