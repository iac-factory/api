import type { ClientRequestArgs, OutgoingHttpHeaders } from "http";
import type { Agent } from "https";
import type { LookupFunction, Socket } from "net";
import URI from "url";
import type { GetObjectCommandInput, PutObjectCommandInput, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Client } from "./client.js";


type Generic = any;
type URL = import("@aws-sdk/types").StringSigner | string;
type Commands = GetObjectCommandInput | PutObjectCommandInput | Generic;

interface Settings {
    headers?: OutgoingHttpHeaders | undefined;
    setHost?: boolean | undefined;
    lookup?: LookupFunction | undefined;
    agent: boolean;
    socketPath?: string | undefined;
    method: string;
    auth?: string | null | undefined;
    createConnection?: ( (options: ClientRequestArgs, oncreate: (err: Error, socket: Socket) => void) => Socket ) | undefined;
    timeout?: number | undefined;
    maxHeaderSize?: number | undefined;
    defaultPort?: number | string | undefined;
    path: string | null | undefined;
    protocol?: string | null | undefined;
    hostname?: string | null | undefined;
    rejectUnauthorized?: boolean;
    _defaultAgent?: Agent | undefined;
    port?: number | undefined;
    localAddress?: string | undefined;
    requestCert: boolean;
    host?: string;
    family?: number | undefined;
    signal?: AbortSignal | undefined;
}

class Signer {
    client: Promise<S3Client> = new Client().instantiate();

    expiration = 900;

    url: URL | Generic;
    settings?: Settings | Generic;

    protected constructor(expiration = 900) {
        this.expiration = expiration;
    }

    /***
     * HTTPs Query Configuration Object
     *
     * @constructor
     *
     */

    protected configuration(): Settings {
        const $: URL | Generic = new URI.URL( String( this.url ) );
        $.rejectUnauthorized = false;
        return $;
    };

    protected async generate(command: Commands) {
        const client = await this.client;

        this.url = await getSignedUrl( client, command, {
            expiresIn: this.expiration
        } );

        this.settings = this.configuration();
    }
}

export { Signer };

export default { Signer };
