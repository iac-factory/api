declare module "IaC.API.Controller" {
    export { Router } from "express";

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

    import type { Request } from "express";
    import type { Response } from "express";
    import type { NextFunction } from "express";
    import type { Express } from "express";
    import type { Send } from "express";
    import type { Application } from "express";
    import type { RequestHandler } from "express";
    import type { ErrorRequestHandler } from "express";
}
