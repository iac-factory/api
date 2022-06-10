/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

// Includes crypto module
import Crypto, { createCipheriv } from "crypto";

const crypto = require( "crypto" );

// openssl list -cipher-algorithms
const algorithm = "aes-256-cbc";

import VM from "vm";


export const key = crypto.randomBytes( 32 );;
export const instance = () => {

    /***
     * Initialization vectors should be unpredictable and unique; ideally, they will be cryptographically random. They do not
     * have to be secret: IVs are typically just added to ciphertext messages unencrypted. It may sound contradictory that
     * something has to be unpredictable and unique, but does not have to be secret; remember that an attacker must not be
     * able to predict ahead of time what a given IV will be.
     *
     * {@link https://en.wikipedia.org/wiki/Initialization_vector Initialization-Vector}
     * */
    const iv = crypto.randomBytes( 16 );

    const cipher = crypto.createCipheriv(algorithm, key, Buffer.from(iv, "hex"));

    const decipher =  (vector: string) => crypto.createDecipheriv( "aes-256-cbc", key, Buffer.from(vector, "hex") );

// An encrypt function
    function encrypt(text: string) {
        const target = cipher;

        const encryption = {
            buffer: target.update( text, "utf-8", "hex"),
            target: Buffer.alloc( 0 )
        };

        // Using concatenation
        encryption.target = Buffer.concat( [ Buffer.from(encryption.buffer, "hex"), target.final() ] );

        // Returning iv and encrypted data
        // return encryption.target.toString( "hex" )
        const normalization = encryption.target.toString("hex");
        const vector = iv.toString("hex");
        return JSON.stringify({normalization, vector});
    }

// A decrypt function
    function decrypt(input: string) {
        const { normalization, vector } = JSON.parse(input);

        console.log(input);

        const target = decipher(vector);

        // Updating encrypted text
        const decryption = {
            buffer: target.update( Buffer.from( normalization, "hex" ) ),
            target: Buffer.alloc( 0 )
        };

        decryption.target = Buffer.concat( [ decryption.buffer, target.final() ] );

        // returns data after decryption
        return decryption.target.toString( "hex" );
    }

    function decode(input: string) {
        return Buffer.from(input, "hex").toString("utf-8")
    }

    return {
        key,
        iv,
        cipher,
        decipher,
        encrypt,
        decrypt,
        decode
    }
}

// Encrypts output

export const i = instance();
const context = i.encrypt( "Test");

// Decrypts output
console.log( i.decode(i.decrypt( context )) );
