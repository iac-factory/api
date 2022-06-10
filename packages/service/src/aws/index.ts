/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

export * as Lambda from "./lambda";

/*** Module Testing */
void ( async () => {
    const debug = ( process.argv.includes( "--debug" ) && process.argv.includes( "--aws-lambda" ) );

    const test = async () => {
        const { Lambda } = await import(".");

        const endpoints = await Lambda.Composition.Endpoints();

        console.log( Lambda.Inspect( endpoints ) );
    };

    ( debug ) && await test();
} )();
