/***
 * @module
 *
 * The following module is the primary entry-point to the S3 package,
 * and is consequently the only export.
 *
 */

import type FS from "fs";

import type { GetObjectCommandInput } from "@aws-sdk/client-s3";
import { GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

import { Stream } from "./stream.js";

/***
 * AWS S3 Presigned-URL File Interface
 *
 * @example
 * const interface = new File();
 * await interface.get({
 *      Bucket: "aws-s3-example-bucket-name",
 *      Key: "example-file.zip"
 * });
 *
 * @param expiration {number}
 *
 */
class File extends Stream {
    /***
     * AWS S3 Presigned-URL File Interface
     *
     * @example
     * const interface = new File();
     * await interface.get({
     *      Bucket: "aws-s3-example-bucket-name",
     *      Key: "example-file.zip"
     * });
     *
     * @param expiration {number}
     *
     */

    constructor(expiration = 300) {
        super( expiration );
    }

    /***
     * GET an AWS S3 Object via Pre-Signed URL
     *
     * **Note**: S3 `Bucket` parameter should not contain "s3://" protocol prefix.
     */

    async get(settings: Input, local: Location) {
        const location = String( ( local ) ? local : settings[ "Key" ] );
        const command = new GetObjectCommand( settings );

        await this.generate( command );

        return this.download( location );
    }

    /***
     * PUT an AWS S3 Object via Pre-Signed URL
     *
     * @returns {Promise<void>}
     *
     * @param settings { SDK.PutObjectCommandInput }
     * @param remote {PathLike | string}
     *
     * @param debug {boolean}
     *
     */

    async put(settings: Input, remote: Location, debug: boolean = false) {
        const location = String( ( remote ) ? remote : settings.Key );

        const command = new PutObjectCommand( settings );

        await this.generate( command );

        const descriptor = this.download( location );

        ( debug ) && console.debug( "[Debug] Response", descriptor );

        return descriptor;
    }
}

type Input = GetObjectCommandInput;
type Location = FS.PathOrFileDescriptor | FS.PathLike | string | null | undefined;

export { File };

export default File;
