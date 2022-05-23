import FS from "fs";
import HTTP from "http2";
import Crypto from "crypto";
import Subprocess from "child_process";

import { Router } from "./src";

import type { HTTP as Types } from "@iac-factory/api-schema";

function tls() {
    return Crypto.generateKeyPairSync( "rsa", {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
            cipher: "aes-256-cbc",
            passphrase: "Development"
        }
    } );
}

function setup() {
    const {
        publicKey,
        privateKey
    } = tls();

    FS.writeFileSync( "private.pem", privateKey );
    FS.writeFileSync( "public.pem", publicKey );

    Subprocess.execSync( [ "openssl", "req", "-config", "development.conf", "-key", "private.pem", "-new", "-x509", "-days", "365", "-out", "certificate.crt" ].join( " " ) );

    return {
        key: FS.readFileSync( "private.pem" ),
        cert: FS.readFileSync( "certificate.crt" ),
        passphrase: "Development",
        enableTrace: false,
        rejectUnauthorized: false
    };
}

/*** @ts-ignore */
const router = Router() as Router.prototype;
router.get( "/", async (request: any, response: import("http2").Http2ServerResponse) => {
    response.setHeader( "Content-Type", "Application/JSON" );
    response.end( JSON.stringify( {
        Key: "Value"
    } ), "utf-8" );
} );

router.get( "/test", async (request: any, response: import("http2").Http2ServerResponse) => {
    response.setHeader( "Content-Type", "Application/JSON" );
    response.end( JSON.stringify( {
        Key: "Value"
    } ), "utf-8" );
} );

const server = HTTP.createSecureServer( { allowHTTP1: true, ... setup() }, async (request: HTTP.Http2ServerRequest, response: HTTP.Http2ServerResponse) => {
    router( request, response );
} );

server.listen( 3000, "localhost", 8192, () => {
    console.debug( "[Debug] Listening via https://localhost:3000" );
} );

export {};
