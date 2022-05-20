// import * as core from "express-serve-static-core";
// import * as express from "express";
// import * as http from "http";
// import * as https from "https";
// import * as ws from "ws";
//
// declare module "Express" {
//     export type Options = import("express").RouterOptions;
//
//     export function Router(options?: Options): Socket.Router;
// }
//
// export declare function Socket(app: express.Application, server?: http.Server | https.Server, options?: Socket.Options): Socket.Instance;
//
// export declare namespace Socket {
//     export type Application = express.Application & WithWebsocketMethod;
//     export type Router = express.Router & WithWebsocketMethod;
//
//     export interface Options {
//         leaveRouterUntouched?: boolean | undefined;
//         wsOptions?: ws.ServerOptions | undefined;
//     }
//
//     export interface RouterLike {
//         get: express.IRouterMatcher<this>;
//
//         [ key: string ]: any;
//
//         [ key: number ]: any;
//     }
//
//     export interface Instance {
//         app: Application;
//
//         applyTo(target: RouterLike): void;
//
//         getWss(): ws.Server;
//     }
//
//     export type WebsocketRequestHandler = (ws: ws, req: express.Request, next: express.NextFunction) => void;
//     export type WebsocketMethod<T> = (route: core.PathParams, ... middlewares: WebsocketRequestHandler[]) => T;
//
//     export interface WithWebsocketMethod {
//         ws: WebsocketMethod<this>;
//     }
// }
//
// export default Socket;
