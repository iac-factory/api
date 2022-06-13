/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "Body-Parser", "magenta" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

/***
 * Node.JS `crypto` Validation
 * ---
 *
 * @returns {Promise<void>}
 * @constructor
 */
const Cryptography = async () => {
    try {
        await import("crypto");
    } catch ( error ) {
        const write: Promise<boolean> = new Promise( (callback) => {
            process.stderr.write(
                {
                    chunk: JSON.stringify( {
                        exception: "Crypto Support is Disabled",
                        error
                    }, null, 4 ), encoding: () => callback( true )
                }
            );

            process.exitCode = 1;
        } );

        ( await write ) && process.exit();
    }
};

export { Cryptography };
export default Cryptography;
