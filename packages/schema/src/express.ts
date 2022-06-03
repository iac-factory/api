declare module "IaC.API.Controller" {
    export { Router } from "express";

    export module IaC {
        type Remove<Input extends string, Tail extends string> = Input extends `${ infer Partially }${ Tail }` ? Partially : Input;
        type Derive<Generic extends string> = Remove<Remove<Remove<Generic, `/${ string }`>, `-${ string }`>, `.${ string }`>;

        export interface Dictionary {
            [ key: string ]: string;
        }

        export type Parameters<Route extends string> = string extends Route
            ? Dictionary
            : Route extends `${ string }:${ infer Tail }`
                ? (
                Derive<Tail> extends never
                    ? Dictionary
                    : Derive<Tail> extends `${ infer Parameter }?`
                        ? { [Variable in Parameter]?: string }
                        : { [Variable in Derive<Tail>]: string }
                ) &
                ( Tail extends `${ Derive<Tail> }${ infer Recursion }`
                    ? Parameters<Recursion> : unknown )
                : {};

        export type { Request };
        export type { Response };
    }

    export module Express {
        export type { Request };
        export type { Response };
        export type { Express };
        export type { Send };
        export type { Application };
        export type { Handler };
    }

    interface Handler {
        Request: RequestHandler;
        Error: ErrorRequestHandler;
        Response: NextFunction;
    }

    import type { Request, Response, NextFunction, Express, Send, Application, RequestHandler, ErrorRequestHandler } from "express";
}
