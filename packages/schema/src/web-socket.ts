import * as core from "express-serve-static-core";
import * as express from "express";
import * as http from "http";
import * as https from "https";
import * as ws from "ws";

declare module "Express" {
    type Options = import("express").RouterOptions;

    function Router(options?: Options): Socket.Router;
}

export declare function Socket(app: express.Application, server?: http.Server | https.Server, options?: Socket.Options): Socket.Instance;

export declare namespace Socket {
    type Application = express.Application & WithWebsocketMethod;
    type Router = express.Router & WithWebsocketMethod;

    interface Options {
        leaveRouterUntouched?: boolean | undefined;
        wsOptions?: ws.ServerOptions | undefined;
    }

    interface RouterLike {
        get: express.IRouterMatcher<this>;

        [ key: string ]: any;

        [ key: number ]: any;
    }

    interface Instance {
        app: Application;

        applyTo(target: RouterLike): void;

        getWss(): ws.Server;
    }

    type WebsocketRequestHandler = (ws: ws, req: express.Request, next: express.NextFunction) => void;
    type WebsocketMethod<T> = (route: core.PathParams, ... middlewares: WebsocketRequestHandler[]) => T;

    interface WithWebsocketMethod {
        ws: WebsocketMethod<this>;
    }
}

export default Socket;