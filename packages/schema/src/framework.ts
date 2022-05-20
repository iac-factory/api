/***
 * For all intents and purposes, the following type-module can be thought
 * as a reference module to Express || Router related type-declarations.
 */

import { Router } from "express";

declare namespace Express {
    export interface Request {
        originalMethod?: string | undefined;
    }
}

declare namespace e {
    export interface Proxy extends Router {}
}

export = e;