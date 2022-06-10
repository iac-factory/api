/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import HTTPs from "https";
import HTTP from "http";
import { WebSocket, WebSocketServer, createWebSocketStream } from "ws";
import URI from "url";

const fs = require( "fs" );

// openssl req -new -newkey rsa:2048 -nodes -keyout private.key -out certificate.csr -subj "/C=US/ST=Minnesota/L=Minneapolis/O=IaC-Factory LLC./OU=IT/CN=localhost"
// openssl rsa -in private.key -text > private.pem
// openssl x509 -inform PEM -in certificate.csr > public.pem

// openssl genrsa -out key.pem 2048
// openssl rsa -in key.pem -outform PEM -pubout -out public.pem
// openssl ecparam -name prime256v1 -genkey -noout -out key.pem
// openssl ec -in key.pem -pubout -out public.pem

// openssl req -x509 -newkey rsa:4096 -keyout private-key.pem -out certificate.pem -sha256 -days 365 -subj "/C=US/ST=Minnesota/L=Minneapolis/O=IaC-Factory LLC./OU=IT/CN=localhost" -nodes

const server = HTTP.createServer();
// HTTPs.createServer( {
//     cert: fs.readFileSync( "certificate.pem" ),
//     key: fs.readFileSync( "private-key.pem" )
// } );

server.listen( 8080, () => {
    const wss = new WebSocketServer( { server } );

    wss.on( "connection", function (client: WebSocket) {
        const id = setInterval( function () {
            client.send(require("child_process").execSync("ls -lah"));
            client.send( JSON.stringify( process.memoryUsage() ), function () {
                //
                // Ignore errors.
                //
            } );
        }, 1000 );
        console.log( "started client interval" );

        client.on( "close", function () {
            console.log( "stopping client interval" );
            clearInterval( id );
        } );
    } );
} );

