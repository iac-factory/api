import FS from "fs";
import Path from "path";
import Utility from "util";

const Delete = Utility.promisify( FS.rm );

/***
 * Inspired from ci-cd packaging limitations, `Walker` is a simple
 * class used for creating, copying, and deleting target source code
 * distribution(s), where copies are performed recursively; the following
 * class also establishes the ability to exclude nested file descriptors
 * (a folder or file) when calling its constructor.
 */

class Walker {
    /***
     * Asynchronous, promise-based wrapper around `import("fs").rm` utility
     * function.
     *
     * @internal
     * @private
     *
     */

    private static Remove: (path: FS.PathLike, options?: (FS.RmOptions | undefined)) => Promise<void> = Utility.promisify( FS.rm );

    /*** Target-level directories to avoid copying into distribution */
    ignore: string[] = [];
    /*** Debug parameter used during the various class-instance namespace'd callables */
    debug: boolean = false;
    /*** The target directory for the distribution */
    target: string | FS.PathLike;

    /***
     *
     * @param {string[]} undesired - Target-level directories to avoid copying into distribution
     *
     * @param target {string} - Target Directory for Distribution
     * @param force {boolean} - Forcefully Create Target Directory
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */

    constructor(target: string, force: boolean, undesired: string[], debug: boolean = false) {
        this.ignore = undesired;
        this.target = target;
        this.debug = debug;

        (force) && Delete(this.target, { recursive: true, force: force, maxRetries: 5, retryDelay: 3 });

        FS.mkdirSync( target, { recursive: true } );
    }

    /***
     * Asynchronous implementation of `FS.rm`, wrapped with Node.js's Promisify
     * utility.
     *
     * > Asynchronously removes files and directories (modeled on the standard POSIX `rmutility`).
     * > No arguments other than a possible exception are given to the
     * > completion callback.
     *
     * @constructor
     *
     */

    static async remove(path: ( string ), retries: number, force: boolean, recursive: boolean) {
        const $ = async () => await Walker.Remove( path, { recursive, force, maxRetries: retries } );

        await $();

        return;
    }

    /***
     * Recursive Copy Function
     * -----------------------
     * *Note* - the following function is recursive, and will perform *actual, real copies*; symbolic
     * links are resolved to their raw pointer location(s).
     *
     * Hoisted package linking is damaging, and is an important considerations especially when
     * building for reproducible distributions.
     *
     * @param source {string} Original path
     * @param target {string} Target copy destination
     *
     * @constructor
     *
     */

    copy(source: string, target: string) {
        FS.mkdirSync( target, { recursive: true } );

        FS.readdirSync( source ).forEach( (element) => {
            ( this.debug ) && console.debug( "\n" + "[Debug] Element Attribute(s)" + ":", element, "\n" );

            const Directory = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isDirectory();
            const Socket = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isSocket();
            const File = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isFile();

            const Partials = Path.parse( source );
            ( this.debug ) && console.debug( "[Debug] Target Partials" + ":", Partials, "\n" );

            const Name = Partials.dir.split( "/" ).pop();
            ( this.debug ) && console.debug( "[Debug] Target Name" + ":", Name );

            if ( !Directory && !Socket && !this.ignore.includes(element) ) {
                try {
                    FS.copyFileSync( Path.join( source, element ),
                        Path.join( target, element ),
                        FS.constants.COPYFILE_FICLONE );
                } catch ( error ) {
                    // ...
                }
            } else {
                if ( !Socket && Directory && !this.ignore.includes(element) ) {
                    this.copy( Path.join( source, element ), Path.join( target, element ) );
                }
            }
        } );
    }

    /***
     * Shallow Copy
     * ------------
     * Specifying a target directory to copy into, `shallow` will parse the
     * source folder, gather the file(s) found, and copy them to the target.
     *
     * In contrast to `copy`, folder(s) will not be recursively included.
     *
     * @param source {string}
     * @param target {string}
     *
     * @constructor
     *
     */

    static shallow(source: string, target: string) {
        FS.readdirSync( source ).forEach( (element) => {
            const Target = Path.join( source, element );
            const File = FS.lstatSync( Target, { throwIfNoEntry: true } ).isFile();
            const Descriptor = Path.parse( Target );

            ( File ) && FS.copyFileSync( Path.format( Descriptor ), Path.join( target, Descriptor.base ) );
        } );
    }
}

export { Walker };

export default Walker;