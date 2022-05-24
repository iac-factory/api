// import HTTP, { RequestListener } from "http";
// import express from "express";
// import ws, { WebSocket } from "ws";
// import Network from "net";
//
// import websocketUrl from "./websocket-url";
// import addWsMethod from "./add-ws-method";
//
// import type { Application, Router } from "express";
//
// export default function expressWs(application: Application & Router, server: HTTP.Server, options: Network.ListenOptions & object = {}) {
//     const settings = Reflect.construct( Object, [ { ... options } ] );
//
//     if (server === null || server === undefined) {
//         /* No HTTP server was explicitly provided, create one for our Express application. */
//         server = HTTP.createServer(application);
//         Reflect.set(application, "listen", function (...args: [number, string, number?, (() => void)?]) {
//             return server.listen(args);
//         });
//     }
//
//     /* Make our custom `.ws` method available directly on the Express application. You should
//      * really be using Routers, though. */
//     addWsMethod( application );
//
//     /* Monkeypatch our custom `.ws` method into Express' Router prototype. This makes it possible,
//      * when using the standard Express Router, to use the `.ws` method without any further calls
//      * to `makeRouter`. When using a custom router, the use of `makeRouter` may still be necessary.
//      *
//      * This approach works, because Express does a strange mixin hack - the Router factory
//      * function is simultaneously the prototype that gets assigned to the resulting Router
//      * object. */
//     if ( !settings.leaveRouterUntouched ) {
//         addWsMethod( express.Router );
//     }
//
//     // allow caller to pass in options to WebSocketServer constructor
//     const wsOptions = settings.wsOptions || {};
//     wsOptions.server = server;
//     const wsServer = new ws.Server( wsOptions );
//
//     wsServer.on( "connection", (socket: WebSocket & { upgradeReq?: any }, request: HTTP.IncomingMessage & { ws: WebSocket & { upgradeReq?: any }, wsHandled?: boolean }) => {
//         if ('upgradeReq' in socket) {
//             request = socket.upgradeReq;
//         }
//
//         request.ws = socket;
//         request.wsHandled = false;
//
//         /* By setting this fake `.url` on the request, we ensure that it will end up in the fake
//          * `.get` handler that we defined above - where the wrapper will then unpack the `.ws`
//          * property, indicate that the WebSocket has been handled, and call the actual handler. */
//         request.url = websocketUrl( request.url as string );
//
//         const mock = Reflect.construct(HTTP.ServerResponse, [request]);
//         mock.writeHead = function (statusCode: number) {
//             if ( statusCode > 200 ) {
//                 /* Something in the middleware chain signalled an error. */
//                 mock._header = ""; // eslint-disable-line no-underscore-dangle
//                 socket.close();
//             }
//         };
//
//         Reflect.set(application, "handle", function (request: { wsHandled: any; }, mock: any) {
//             if ( !request.wsHandled ) {
//                 /* There was no matching WebSocket-specific route for this request. We'll close
//                  * the connection, as no endpoint was able to handle the request anyway... */
//                 socket.close();
//             }
//         });
//     } );
//
//     return {
//         application,
//         getWss: function getWss() {
//             return wsServer;
//         },
//         applyTo: function applyTo(router: Router) {
//             addWsMethod( router );
//         }
//     };
// }

export {};
