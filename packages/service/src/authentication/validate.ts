/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { v4 as UUID } from "uuid";
import Cryptography from "bcrypt";
import Token, { SignOptions } from "jsonwebtoken";

import { User } from "@iac-factory/api-database";
import { HTTP } from "@iac-factory/api-schema";

import { Debugger } from "@iac-factory/api-core";

/***
 * JWT Login Verification
 * ---
 *
 * @param server {string}
 * @param {HTTP.Response} response
 * @param {string} username
 * @param {string} password
 *
 * @returns {void}
 *
 * @constructor
 */
export const JWT = async function (server: string, response: HTTP.Response, username: string, password: string): Promise<void | HTTP.Response> {
    const Record = await User.findOne( { Username: username } ) ?? null;

    /*** @experimental */
    const Logger = Debugger.hydrate( {
        module: [ "Authorization", "white" ],
        level: [ "Debug", "cyan" ],
        depth: [ 1, true ]
    } );

    Logger.debug( "Server" + ":" + " " + server );

    const verification = async () => ( Record ) ? new Promise( (resolve) => {
        const hash = Record.password as string;

        Cryptography.compare( password, hash, (error, success) => {
            ( error ) && Logger.warn( "Invalid Authorization Attempt" + " " + "(" + username + ")" );
            ( success ) && Logger.debug( "Valid Authorization Attempt" + " " + "(" + username + ")" );

            if ( error ) throw error;

            resolve( success );
        });
    } ) : null;

    const valid = await verification();
    if ( ( !Record ) || ( !valid ) ) {
        return response.status( 401 )
            .set( "WWW-Authenticate", "Token-Exchange" )
            .send( "Invalid Username & Password Combination" );
    }

    const { id } = Record;
    const uid = UUID();

    const fields: SignOptions = {
        subject: username,
        audience: [
            server,
            "Internal",
            "Access" // "Refresh",
        ],
        issuer: "IaC-API",
        expiresIn: "1d",
        algorithm: "HS256",
        encoding: "utf-8",
        header: {
            alg: "HS256",
            typ: "JWT",
            cty: "Application/JWT"
        }
    };

    Token.sign( { id, uid }, process.env[ "SECRET" ]!, fields, (exception, token) => {
        if (exception) throw exception;

        Logger.debug( "JWT Token" + " " + "(" + token + ")" );
        response.set( "Content-Type", "Application/JWT" )
            .status( 200 ).send( token );
    } );
};

export default JWT;
