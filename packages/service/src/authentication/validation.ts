/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import Token, { Jwt } from "jsonwebtoken";

import { User } from "@iac-factory/api-database";

function Valid(evaluations: Array<boolean>) {
    return evaluations.every( (element: boolean) => {
        return element === evaluations[ 0 ];
    } );
}

/***
 * JWT Verification
 * ---
 * @returns {void}
 *
 * @constructor
 * @param jwt
 */
export const Validation = async function (jwt: string, origin: string) {
    /***
     * Unverified, Decoded JWT
     * ---
     * It's elected to use an unverified method prior `Token.verify` due
     * to the JWT's *publicly* available, validative properties. For example,
     * the expiration and origin (IP-Address) claims can be checked
     * also while grabbing the User's database record.
     *
     * The difference in timing is quite substantial.
     *
     * */
    const target = Token.decode( jwt, {
        complete: true, json: true
    } ) as ( Jwt & { payload: { id: string, uid: string, exp: number, iat: number, sub: string } } );

    if ( !( target?.payload ) || !( target.payload.sub ) || !( target.payload.uid ) || !( target.payload.iat ) ) return false;

    const time = new Date(Date.now());

    const user = target.payload.sub;

    const expiration = new Date( target.payload.exp * 1e3 );

    const validation = { origin: false, username: false, expiration: false };

    const record = await User.findOne( { _id: target.payload.id } );

    validation.username = record?.username === user;
    validation.origin = record?.login?.origin === origin;
    validation.expiration = time < expiration && expiration < record!.login!.expiration!

    if (!(Valid(Object.values(validation)))) return false;

    try {
        const proceed = !!(Token.verify( jwt, process.env[ "SECRET" ]!, {
            complete: true, issuer: process.env[ "ISSUER" ]!, subject: user
        } ));

        return (proceed) ? { username: record?.username } : false;
    } catch ( exception ) {
        return false
    }
};

export default Validation;
