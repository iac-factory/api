/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { v4 as UUID }         from "uuid";
import Token, { SignOptions } from "jsonwebtoken";

import { User } from "@iac-factory/api-database";
import { HTTP } from "@iac-factory/api-schema";

const Unauthorized = (response: HTTP.Response) => response.status( 401 ).set( "WWW-Authenticate", "Token-Exchange" ).send( "Invalid Username & Password Combination" );

/***
 * JWT Login Generation
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
export const JWT = async function (server: string, ip: string, response: HTTP.Response, username: string, password: string): Promise<void | HTTP.Response> {
    const record = await User.findOne( { Username: username } );

    if ( !( record ) ) return Unauthorized( response );

    /*** Validate the User's Password --> Hash */
    const [ valid, _ ] = await record.compare( password );

    if ( !( valid ) ) return Unauthorized( response );

    const { id } = record;
    const fields: SignOptions = {
        subject: username.toLowerCase(),
        issuer: "Internal",
        expiresIn: "1d",
        algorithm: "HS256",
        encoding: "utf-8",
        header: {
            alg: "HS256",
            typ: "JWT",
            cty: "Application/JWT"
        }
    };

    Token.sign( { id, uid: UUID() }, process.env[ "SECRET" ]!, fields, async (exception, token) => {
        if ( exception ) throw exception;
        if ( !( token ) ) throw new TypeError("Token Cannot be Undefined");

        const time = new Date( Date.now() );
        const expiration = new Date (Date.now() + 24 * ( 60 * 60 * 1000 ) );

        await record.authorize( {
            date: time,
            expiration: expiration,
            token: token,
            origin: ip
        } );

        await record.updateOne();
        await record.save();

        response.set( "Content-Type", "Application/JWT" ).status( 200 ).send( token );
    } );
};

export default JWT;
