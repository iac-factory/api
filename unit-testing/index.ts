import FS from "fs";

export * from "../main";

import * as Main from "../main";

export const Remove = Main.Remove;

/***
 * Promisified Version of {@link FS.open}
 * ---
 *
 * Asynchronously open, optionally create if the file doesn't exist, a target file-descriptor.
 *
 * @experimental
 *
 * @param {string} target
 * @returns {Promise<void>}
 *
 * @constructor
 *
 */
export const File = async (target: string): Promise<Error | number> => {
    return new Promise( (resolve) => {
        FS.open( target, "w", 0o666, (error, descriptor) => {
            if ( error ) throw error;

            resolve( descriptor );
        } );
    } );
};

/***
 * Promisified Version of {@link FS.mkdir}
 * ---
 *
 * Asynchronously open, optionally create if the file doesn't exist, a target file-descriptor.
 *
 * @experimental
 *
 * @param {string} target
 * @returns {Promise<void>}
 *
 * @constructor
 *
 */
export const Directory = async (target: string): Promise<Error | string | FS.PathOrFileDescriptor | undefined> => {
    return new Promise( (resolve) => {
        FS.mkdir( target, { recursive: true, mode: 0o764 }, (error, directory) => {
            if ( error ) throw error;

            resolve( directory );
        } );
    } );
};

export default Main;

export { Main };
