/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

export * from "./module";

void ( async () => {
    const debug = ( process.argv.includes( "--debug" ) && process.argv.includes( "--pg" ) );

    const test = async () => {
        const { PG } = await import(".");

        await PG.Version();
    };

    ( debug ) && await test();
} )();
