/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import WebSocket from "ws";
import fs from "fs";

const ws = new WebSocket( "ws://localhost:8080/foo");
//     , {
//     cert: fs.readFileSync("certificate.pem"),
//     key: fs.readFileSync("private-key.pem"),
//     rejectUnauthorized: false
// } );

ws.on( "open", function open() {
    ws.on("message", (event: Buffer) => {
        console.log(event.toString("utf-8"));
    });
    ws.on("test", (data) => {
        console.log(data);
    })
} );
