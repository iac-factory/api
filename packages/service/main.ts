import Framework from "express";

import API, { Router } from "express";

type Options = { strict: boolean; casing: boolean; merge: boolean };
export type Reflection = ( options?: Options ) => Router;

Reflect.set(Framework, "Reflection", (options?: { strict: boolean; casing: boolean; merge: boolean }) => {
    const Instance: typeof Router = Reflect.get(Framework, "Router");

    return Instance({
        strict: options?.strict ?? true,
        caseSensitive: options?.casing ?? false,
        mergeParams: options?.merge ?? false
    });
});

export const Controller: Reflection = Reflect.get(Framework, "Reflection");

export { Framework };

export const Application = API();

export type Server = typeof Application;

export default Application;

export * from "./src";