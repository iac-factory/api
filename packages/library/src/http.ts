import HTTP2 from "http2";
export module HTTP {
    export type Request = import("express").Request & import("http2").Http2ServerRequest & { params: any; baseUrl: string; next: any; originalUrl: string; route: any };
    export type Response = import("express").Response;
    export type Next = import("express").NextFunction;
    export type Error = import("express").Errback;
    export type Router = import("express").Router;
    export type Route = import("express").IRoute;
    export type Application = import("express").Application;
    export type Handler = import("express").Handler;
}

export default HTTP;