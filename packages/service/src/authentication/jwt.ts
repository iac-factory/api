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

/***
 * JWT Login Generation
 * ---
 *
 * @param {string} server
 * @param {string} ip
 * @param {string} username
 * @param {string} password
 *
 * @returns {void}
 *
 * @constructor
 */
export const JWT = async function (server: string, ip: string, username: string, password: string): Promise<void | null> {
    const record = await User.findOne( { Username: username } );

    if ( !( record ) ) return null;

    /*** Validate the User's Password --> Hash */
    const [ valid, _ ] = await record.compare( password );

    if ( !( valid ) ) return null;

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

        return token;
    } );
};

export default JWT;
