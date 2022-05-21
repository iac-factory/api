const CJS = {
    cache: false,
    esModule: true,
    extensions: true,
    mutableNamespace: true,
    namedExports: true,
    paths: true,
    vars: true,
    dedefault: false,
    topLevelReturn: true
}

require = require( "esm" )( module, { cjs: CJS, mode: "auto", force: true, await: true, cache: false, sourceMap: true } );

module.exports = require( "./main" );

import * as crypto from "crypto";
import * as subprocess from "child_process";
import * as fs from "fs";

export * from "./main";

var http2 = require( "http2" );
var { Router } = require( "./src" );

var router = Router();
router.get( "/", async (request: any, response: import("http2").Http2ServerResponse) => {
    response.setHeader("Content-Type", "Application/JSON");
    response.end(JSON.stringify({
        Key: "Value"
    }), "utf-8");
} );

const {
    publicKey,
    privateKey
} = crypto.generateKeyPairSync( "rsa", {
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

fs.writeFileSync( "private.pem", privateKey );
fs.writeFileSync( "public.pem", publicKey );

subprocess.execSync( [ "openssl", "req", "-config", "development.conf", "-key", "private.pem", "-new", "-x509", "-days", "365", "-out", "certificate.crt" ].join( " " ) );

type Options = import("https").ServerOptions;

const options: Options = {
    key: fs.readFileSync( "private.pem" ),
    cert: fs.readFileSync( "certificate.crt" ),
    passphrase: "Development",
    enableTrace: false,
    rejectUnauthorized: false
};

var server = http2.createSecureServer( { allowHTTP1: true, ... options }, async (request: import("http2").Http2ServerRequest, response: import("http2").Http2ServerResponse) => {
    /// router( request, response, await finalhandler( request, response ) );
    router(request, response);
} );

server.listen( 3000, "localhost", "8192", () => {
    console.log("Listening via https://localhost:3000");
} );
