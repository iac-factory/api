/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import FS      from "fs";
import Path    from "path";
import Process from "process";

/***
 * Only paths that can be converted to UTF8 strings are supported
 *
 * @param {string} descriptor
 * @returns {Promise<NodeJS.ErrnoException | boolean>}
 */
const valid = async (descriptor: string) => {
    return new Promise<NodeJS.ErrnoException | string | null>( (resolve) => {
        FS.open( descriptor, (exception) => {
            resolve( ( exception ) ? null : descriptor );
        } );
    } );
};

/***
 * Take every binary system path and concatenate the target `bin` name
 * ---
 *
 * @param {string | FS.PathLike} bin
 * @returns {string[]}
 */
async function reducer(bin: string | FS.PathLike) {
    const collection = ( Process.env.PATH || "" ).replace( /["]+/g, "" ).split( Path.delimiter ).map( (chunk) => {
        return ( Process.env.PATHEXT || "" ).split( Path.delimiter ).map( (ext) => {
            return Path.join( chunk, bin + ext );
        } );
    } ).reduce( (source, target) => {
        return source.concat( target );
    } );

    return collection;
}

/***
 *
 * @returns {Promise<void>}
 * @constructor
 * @param application
 */
export const Program = async (application: string | FS.PathLike) => {
    const paths = await reducer( application );

    for await (const target of paths) {
        if (await valid(target)) return target;
    }

    return void 0;
};

export default Program;