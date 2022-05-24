// Rainbow Table Brute-Force Attacks https://en.wikipedia.org/wiki/Rainbow_table
// Blowfish Cryptography https://en.wikipedia.org/wiki/Blowfish_(cipher)
// Cryptographic Salting https://en.wikipedia.org/wiki/Salt_(cryptography)

// ORM Middleware https://mongoosejs.com/docs/middleware.html
/// import { Schema } from "./../../user";

const SALT_TUMBLE_FACTOR = 15;

const Hash = () => {
    // Schema.hash = function ( callback: Function ) {
    //     const $ = this;
    //
    //     if ( !$.isModified( "Password" ) ) callback();
    //
    //     genSalt( SALT_TUMBLE_FACTOR, function ( error, salt ) {
    //         if ( error ) return callback( error );
    //
    //         console.debug( "[Hashing]", "[Debug]", "Instantiating Password Hashing Function ..." );
    //
    //         // Hash Password & Salt
    //         hash( Schema.Password as string, salt, function ( error, hash ) {
    //             if ( error ) return callback( error );
    //             Schema.Password = hash; // Override Plaintext Password with Updated Hash
    //             console.debug( "[Hashing]", "[Debug]", "Salt + Hash Successfully Established" );
    //
    //             callback();
    //         } );
    //     } );
    // }
};

export { Hash };

export {};
