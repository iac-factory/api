/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import cluster from "node:cluster";
import { cpus } from "node:os";
import process from "node:process";

import { Banner } from "./test.banner";
import Network from "net";
import Utility from "util";

import HTTP from "http";

const numCPUs = cpus().length;

const Socket = (port: number, address: string, pid: number | undefined) => {
    const controller = new AbortController();

    const server = Network.createServer( {
        pauseOnConnect: true,
        allowHalfOpen: true
    }, (socket) => {
        socket.setEncoding( "utf-8" );
        socket.setKeepAlive( true, 2.5e3 );
        socket.setTimeout( 1e4 );

        socket.on( "end", () => {
            console.log(Reflect.get(socket, "server"));
            console.log( "client disconnected" );
        } );

        socket.on("status", () => {
            console.log("Server Status", server.status);
            return server.status;
        })

        socket.write( "hello\r\n" );
        socket.pipe( socket, { end: false } );
    } ) as Network.Server & { state: {}, status: {}, port: number, hostname: string };

    Reflect.set(server, "state", {});
    Reflect.set(server, "status", {});
    Reflect.set(server, "port", port);
    Reflect.set(server, "hostname", address);

    server.on( "error", (exception: NodeJS.ErrnoException) => {
        throw exception;
    } );

    server.on( "connection", (socket: Network.Socket & { state: {} } | NodeJS.ErrnoException) => {
        if ( socket instanceof Network.Socket ) {
            socket.state = "Unavailable";

            const local = {
                address: socket.localAddress,
                type: Network.isIP( socket.localAddress ?? "" ) as 0 | 4 | 6,
                port: socket.localPort,
                readable: socket.readable,
                writable: socket.writable
            };
        } else {
            if ( socket ) {
                const error = socket;

                const signal = ( error.errno )
                    ? Utility.getSystemErrorName( error.errno )
                    : null;

                throw error;
            }
        }

        setTimeout( () => {
            socket.state = "Available";
        }, 30000 );
    } );

    server.listen( {
        port: port,
        host: address,
        signal: controller.signal,
        allowHalfOpen: false,
        exclusive: false,
        readableAll: true,
        writeableAll: true
    }, 511, () => {
        console.log( "Listening", server.address() );
    } );

    return server;
};

const Global = Object.create( {} );

if ( cluster.isPrimary ) {
    ( async () => void await Banner( {} ).then( () => {
        console.log( `Primary ${ process.pid } is running` );

        // Fork workers.
        for ( let i = 0; i < numCPUs; i++ ) {
            const _ = cluster.fork() as import("cluster").Worker;
        }

        cluster.on( "exit", (worker, code, signal) => {
            console.log( `worker ${ worker.process.pid } died`, code, signal );
        } );
    } ) )();

    const server = HTTP.createServer( function (request, response) {
        // router( request, response );
        console.log( "resolve" );
        response.setHeader( "Content-Type", "Application/JSON" );
        response.end( JSON.stringify( {
            Key: "Value"
        } ), "utf-8" );
    } );

    server.listen( 8000, "localhost", 511, () => {
        console.debug( "[Debug] Listening via http://localhost:8000" );
    } );

    server.on( "connection", (event) => {
        if ( cluster.workers ) {
            for ( const [ identifier, worker ] of Object.entries( cluster.workers ) ) {
                if (identifier === "1") {
                    console.log( worker?.id );
                    // console.log(worker?.process.eventNames())
                    const response = worker?.process.send( {
                        message: "Hello World",
                        identifier: worker?.id,
                        origin: "server",
                        pid: worker?.process.pid
                    } );
                    // console.log( { response } );
                }
            }
        }

    } );

    process.addListener( "message", (event) => {
        console.log( event );
    } );
} else {
    if ( cluster.isWorker ) {
        const worker = cluster.worker;
        // @ts-ignore
        const port = 3000 + parseInt(String( worker.id ));
        const host = "localhost";
        const pid = worker?.process.pid;
        // Workers can share any TCP connection
        // In this case it is an HTTP server
        // http.createServer( (req, res) => {
        //     res.writeHead( 200 );
        //     res.end( "hello world\n" );
        // } ).listen( 8000 );

        console.log( `Worker ${ process.pid } started`, process.ppid );

        const server = (worker && worker.id) ? Socket(3000 + parseInt(String( worker.id )), "localhost", worker?.process.pid) : null;

        worker?.process?.on( "message", (message: object & { origin: string }) => {
            // console.log( message );
            // const status = socket?.emit("status");
            // console.log(status);
            // if ( message.origin === "server" ) {
            //     server.on( "connection", (socket) => {
            //         socket.end( "handled by child", socket );
            //     } );
            // }

            //
            server!.on("connection", async (socket) => {
                // console.log(socket);
                const status = socket.resume();
                console.log("Status", status);
                // socket.end("...")
            })

            const connection = Network.createConnection(server?.port as number, server?.hostname);

            connection.on("connect", async () => {
                console.log("CONNECTION");
                console.log(await server?.getConnections((error) => {
                    console.log(error);
                }));

                Reflect.set(connection, "name", "TESTTTT");
            })

            console.log(connection.eventNames());

            // connection.end();
        } );

        // process.on( "message", (message: object, socket) => {
        //     worker?.process?.send( message );
        // } );
    }
}
