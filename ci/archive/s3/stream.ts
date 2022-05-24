import * as Assert from "assert";
import FS from "fs";
import http from "http";
import https from "https";

import type { URL } from "url";

import { Signer } from "./signer.js";

class Stream extends Signer {
    private static stream = ($: URL) => FS.createWriteStream( String( $ ) );

    constructor(expiration: number = 300) {
        super(expiration);
    }

    protected async download(local: Descriptor | Generic) {
        const method = "GET";

        const protocol = !this.url.charAt( 4 )
            .localeCompare( "s" ) ? https : http;
        const file = Stream.stream( local );
        const data: Object | Generic = { response: null, request: null, total: 0 };

        Assert.notEqual(this.settings, undefined);
        const $: Promise<Generic> = new Promise( (resolve, reject) => {
            const request = protocol.get( this.settings, response => {
                if ( response.statusCode !== 200 ) {
                    reject( new Error( JSON.stringify( {
                        error: true,
                        settings: this.settings,
                        status: response.statusMessage,
                        code: response.statusCode
                    }, null, 4 ) ) );

                    return;
                }

                data.request = this.settings;

                data.response = {
                    method: method,
                    headers: response.headers,
                    http: response.httpVersion,
                    status: {
                        code: response.statusCode,
                        message: response.statusMessage
                    }
                };

                response.pipe( file );
            } );

            file.on( "finish", () => {
                resolve( data );
            } );

            request.on( "error", (error) => {
                FS.unlink( local, () => reject( error ) );
            } );

            request.on( "response", (incoming: import("http").IncomingMessage | Generic) => {
                data.total = Number.parseInt( incoming.headers["content-length"], 10 );
            } );

            file.on( "error", (error) => {
                FS.unlink( local, () => reject( error ) );
            } );

            request.end();
        } );

        return data;
    }
}

type Generic = any;

type Descriptor = FS.PathOrFileDescriptor | FS.PathLike | string | null | undefined;

export { Stream };

export default { Stream };
