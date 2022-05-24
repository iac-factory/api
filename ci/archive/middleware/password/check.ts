//// Rainbow Table Brute-Force Attacks https://en.wikipedia.org/wiki/Rainbow_table
//// Blowfish Cryptography https://en.wikipedia.org/wiki/Blowfish_(cipher)
//// Cryptographic Salting https://en.wikipedia.org/wiki/Salt_(cryptography)
//
//// ORM Middleware https://mongoosejs.com/docs/middleware.html

import { compare } from "bcryptjs";
import type ORM from "mongoose";

/***
 *
 * @param Schema
 * @returns {Promise}
 * @constructor
 */
const Check = (Schema: ORM.Schema) => {
    console.debug( "[Validation]", "[Debug]", "Instantiating Cryptographic Validation Function ..." );

    /***
     * @param password {String}
     * @param callback {Function}
     * @param progress {Function}
     * @returns {Promise<Boolean, Error|null>}
     */
    /***
     * @param password {String}
     * @param callback {Function}
     * @param progress {Function}
     * @returns {Promise<Boolean, Error|null>}
     */
    Schema.methods[ "check" ] = function (password: string, callback: Function, progress: Function) {
        const $ = this;

        console.debug( "[Validation]", "[Debug]", "Evaluating Comparator ..." );

        compare( password, $[ "Password" ], function (error: Error, success: boolean) {
            if ( error ) throw error;

            if ( !success ) {
                callback( false, "Failed Password Validation Attempt" );
            } else {
                console.debug( "[Validation]", "[Log]", "Password has been Successfully Validated" );
                callback( true, "Successful" );
            }
        }, (percent: number) => {
            progress( percent );
        } );
    };

    console.debug( "[Validation]", "[Debug]", "Validation Successfully Instantiated" );
};

export { Check };

export {};
