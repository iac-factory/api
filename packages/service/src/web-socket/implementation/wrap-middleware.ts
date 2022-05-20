import type { Request, Response, NextFunction } from "express-serve-static-core";

export default function wrapMiddleware(middleware: (request: Request, response: Request | Response, next: NextFunction) => void) {
    return (request: Request & { ws?: any, wsHandled: boolean }, response: Response, next: NextFunction) => {
        if (request.ws !== null && request.ws !== undefined) {
            request.wsHandled = true;
            try {
                /* Unpack the `.ws` property and call the actual handler. */
                middleware(request.ws, request, next);
            } catch (exception) {
                /* If an error is thrown, let's send that on to any error handling */
                next(exception);
            }
        } else {
            /* This wasn't a WebSocket request, so skip this middleware. */
            next();
        }
    };
}