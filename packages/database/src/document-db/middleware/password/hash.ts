/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

// Rainbow Table Brute-Force Attacks https://en.wikipedia.org/wiki/Rainbow_table
// Blowfish Cryptography https://en.wikipedia.org/wiki/Blowfish_(cipher)
// Cryptographic Salting https://en.wikipedia.org/wiki/Salt_(cryptography)

// ORM Middleware https://mongoosejs.com/docs/middleware.html

import ORM from "mongoose";

import Cryptography from "bcryptjs";

import { Debugger } from "@iac-factory/api-core";

export async function Hash(this: ORM.Schema & { password: string }): Promise<void> {
    const instance = this;
    const logger = Debugger.hydrate( {
        module: [ "Database", "white" ],
        level: [ "Debug", "cyan" ],
        depth: [ 1, true ]
    } );

    logger.debug( "Initializing Password Hashing Utility" );

    void await new Promise( (resolve) => {
        Cryptography.genSalt( parseInt( process.env[ "SALT_TUMBLE_FACTOR" ] ?? "15" ), function (error, salt) {
            if ( error ) throw error;

            logger.debug( "Creating Hash + Salt Combination" );

            Cryptography.hash( instance.password, salt, function (error, hash) {
                if ( error ) throw error;
                instance.password = hash; // Override Plaintext Password with Updated Hash

                logger.debug( "Salt + Hash Successfully Established" );

                resolve( true );
            }, (percent) => {
                ( percent === 1.0 ) && logger.debug( "User Password has Reached 100% Completion" );
                // const output = String(percent.toFixed(5));
                // process.stdout.write(output, "utf-8", async () => {
                //     void new Promise((resolve) => {
                //         setTimeout(() => {
                //             process.stdout.cursorTo(0, process.stdout.rows, () => {
                //                 process.stdout.clearLine(0, () => {
                //                     resolve(void null);
                //                 });
                //             });
                //         }, 250);
                //     });
                // });
            } );
        } );
    } );
}

export default Hash;
