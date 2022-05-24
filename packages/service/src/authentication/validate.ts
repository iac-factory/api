import { v4 as UUID } from "uuid";
import Cryptography from "bcryptjs";

import { User } from "@iac-factory/api-database";
import Token, { /* Algorithm, JwtHeader */ SignOptions } from "jsonwebtoken";

import { HTTP } from "@iac-factory/api-schema";

/***
 * JWT Login Verification
 * ---
 *
 * @param {HTTP.Response} response
 * @param {string} username
 * @param {string} password
 * @returns {Promise<void | HTTP.Response>}
 *
 * @constructor
 */
export const Validate = async function (response: HTTP.Response, username: string, password: string): Promise<void | HTTP.Response> {
    const Record = await User.findOne( { Username: username } ) ?? null;

    const verification = async () => ( Record ) ? new Promise( (resolve) => {
        const hash = Record.password as string;

        Cryptography.compare( password, hash, (error, success) => {
            if ( error ) throw error; /// resolve(false);

            resolve( success );
        }, (percent: number) => {} );
    } ) : null;

    if ( ( !Record ) || ( !await verification() ) ) return response.status( 401 )
        .set("WWW-Authenticate", "Token-Exchange")
        .send( "Invalid Username & Password Combination" );

    const { id } = Record;
    const uid = UUID();

    const fields: SignOptions = {
        subject: "Nexus",
        audience: "Audience",
        issuer: "Cloud-Technology",
        expiresIn: "1d",
        algorithm: "HS256",
        encoding: "utf-8"
    };

    const payload = { id, uid };

    const token = Token.sign( payload, process.env[ "SECRET" ]!, fields );

    response.status( 200 ).send( token );
};

export default Validate;
