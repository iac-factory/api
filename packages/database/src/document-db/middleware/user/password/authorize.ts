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
import { Debugger }   from "@iac-factory/api-core";

export async function Authorize(this: ORM.Schema & { login: { expiration: Date, date: Date, token: string, origin: string } }, session: { expiration: Date, date: Date, token: string, origin: string }) {
    const instance = this;

    const logger = Debugger.hydrate( {
        module: [ "Database", "white" ],
        level: [ "Debug", "cyan" ],
        depth: [ 1, true ]
    } );

    logger.debug( "Mutating User's Login Session ..." );

    return await new Promise<ORM.Schema>( (resolve) => {
        logger.debug( "Evaluating Comparator ..." );

        instance.login = session;

        resolve( instance );
    } );
}

export type Login = typeof Authorize;

export default Login;
