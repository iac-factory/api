/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

//// Rainbow Table Brute-Force Attacks https://en.wikipedia.org/wiki/Rainbow_table
//// Blowfish Cryptography https://en.wikipedia.org/wiki/Blowfish_(cipher)
//// Cryptographic Salting https://en.wikipedia.org/wiki/Salt_(cryptography)
//
//// ORM Middleware https://mongoosejs.com/docs/middleware.html

import ORM from "mongoose";
import { Debugger } from "@iac-factory/api-core";
import { compare }  from "bcrypt";

export async function Compare(this: ORM.Schema & { password: string }, password: string) {
    const logger = Debugger.hydrate( {
        module: [ "Database", "white" ],
        level: [ "Debug", "cyan" ],
        depth: [ 1, true ]
    } );

    logger.debug( "Instantiating Password Validation Function ..." );

    return await new Promise<[boolean, string]>( (resolve) => {
        logger.debug( "Evaluating Comparator ..." );

        compare( password, this.password, function (exception, success: boolean) {
            if ( exception ) throw exception;

            if ( !success ) {
                resolve( [false, "Invalid"] );
            } else {
                logger.debug( "Password has been Successfully Validated" );
                resolve( [true, "Successful"]);
            }
        } );
    } );
}

export type Compare = typeof Compare;

export default Compare;
