/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import WS from "ws";

const ws = new WS( "ws://localhost:8080/foo");

ws.on( "open", function open() {
    ws.on("message", (event: Buffer) => {
        console.log(event.toString("utf-8"));
    });

    ws.on("test", (data) => {
        console.log(data);
    })
} );
