import type http2 from "http2";

import type Framework from "./framework";

export module HTTP {
    export type Request = Framework.Request & http2.Http2ServerRequest & { params: any; baseUrl: string; next: any; originalUrl: string; route: any };
    export type Response = Framework.Response;
    export type Next = Framework.NextFunction;
    export type Error = Framework.Errback;
    export type Router = Framework.Router;
    export type Route = Framework.IRoute;
    export type Application = Framework.Application;
    export type Handler = Framework.Handler;
    export type Status = number;
    export type Headers = NodeJS.Dict<number | string | string[]>
    export type Message = string;
}

export default HTTP;