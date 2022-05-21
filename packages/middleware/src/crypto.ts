import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    namespace: [ "Middleware", "yellow" ],
    module: [ "Body-Parser", "green" ],
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
        const write: Promise<boolean> = new Promise((callback) => {
            process.stderr.write(
                JSON.stringify( {
                    exception: "Crypto Support is Disabled",
                    error
                }, null, 4 ), () => callback(true)
            );

            process.exitCode = 1;
        });

        (await write) && process.exit();
    }
};

export { Cryptography };
export default Cryptography;