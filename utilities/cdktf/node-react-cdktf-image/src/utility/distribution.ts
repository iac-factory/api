import FS      from "fs";
import OS      from "os";
import Path    from "path";
import Process from "process";
import Utility from "util";

/***
 * Inspired from ci-cd packaging limitations, `Walker` is a simple
 * class used for creating, copying, and deleting target source code
 * distribution(s), where copies are performed recursively; the following
 * class also establishes the ability to exclude nested file descriptors
 * (a folder or file) when calling its constructor.
 */

class Walker {
    /***
     * Asynchronous, promise-based wrapper around `import("fs").rm` utility function.
     *
     * @internal
     * @private
     *
     */

    private static Remove: ( path: FS.PathLike, options?: ( FS.RmOptions | undefined ) ) => Promise<void> = Utility.promisify( FS.rm );

    /*** Target-level directories to avoid copying into distribution */
    ignore: string[] = [ "" ];

    /*** Debug parameter used during the various class-instance namespace'd callables */
    debug: boolean = false;

    /*** The target directory for the distribution */
    target: string | FS.PathLike;

    files: string[];

    compilations: string[];

    directory: any;

    /***
     *
     * @param {string[]} undesired - Target-level directories to avoid copying into distribution
     *
     * @param target {string} - Target Directory for Distribution
     * @param debug {boolean} - Debug Parameter
     *
     * @constructs
     *
     */

    constructor( target: string, undesired: string[] = [ "" ], debug: boolean = false ) {
        this.ignore = undesired;
        this.target = target;
        this.debug = debug;

        this.files = [];
        this.compilations = [];

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

    static async remove( path: ( string ), retries: number, force: boolean, recursive: boolean ) {
        const $ = async () => await Walker.Remove( path, { recursive, force, maxRetries: retries } );

        await $();

        return;
    }

    /***
     * Asynchronously, Recursively, Validate & Establish a Directory
     * ---
     *
     * Upon success, the return datatype is of type [string, string, string],
     * where:
     *  - type[0] = (valid) ? File System URI := string : Error := boolean
     *  - type[1] = Full System Path := string
     *  - type[2] = Relative System Path from `Process.cwd()` := string
     *
     * @param {string} path
     *
     * @returns {Promise<(Promise<string | boolean> | string)[]>}
     *
     */

    static async directory( path: string ): Promise<( Promise<string | boolean> | string )[]> {
        /***
         * The right-most parameter is considered {`to`}. Other parameters are considered an array of {`from`}.
         * Starting from leftmost {`from`} parameter, resolves {`to`} to an absolute path.
         * If {`to`} isn't already absolute, {`from`} arguments are prepended in right to left order, until
         * an absolute path is found. If after using all {`from`} paths still no absolute path is found,
         * the current working directory is used as well. The resulting path is normalized, and trailing
         * slashes are removed unless the path gets resolved to the root directory.
         *
         * @type {string}
         *
         */

        const system: string = Path.resolve( path );

        /*** @type {Promise<string | boolean>} */
        const awaitable = new Promise<string | boolean>( ( resolve, reject ) => {
            FS.mkdir( system, { recursive: true, mode: 0o775 }, ( error ) => {
                if ( error && error.code === "EEXIST" ) {
                    console.warn( "[Warning]", error );
                    resolve( system );
                } else if ( error ) {
                    console.warn( "[Warning]", error );
                    reject( false );
                } else {
                    console.warn( "[Warning]", error );
                    resolve( system );
                }
            } );
        } );

        /*** @type {(Promise<string | boolean> | string)[]} */
        return ( typeof ( await awaitable ) === "string" ) ? [
            [
                [ "file", ":", "//" ].join( "" ), system ].join( "" ),
                system,
                Path.relative(Process.cwd(), system)
        ] : [
            awaitable,
            system,
            Path.relative(Process.cwd(), system)
        ];
    }

    /***
     * Recursive Copy Function
     *
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

    copy( source: string, target: string ) {
        const directory = FS.mkdirSync( target, { recursive: true } );

        console.log( directory );
        process.exit( 0 );

        FS.readdirSync( source ).forEach( ( element ) => {
            ( this.debug ) && console.debug( "\n" + "[Debug] Element Attribute(s)" + ":", element, "\n" );

            const Directory = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isDirectory();
            const Socket = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isSocket();
            const File = FS.lstatSync( Path.join( source, element ), { throwIfNoEntry: true } ).isFile();

            const Partials = Path.parse( source );
            ( this.debug ) && console.debug( "[Debug] Target Partials" + ":", Partials, "\n" );

            const Name = Partials.dir.split( "/" ).pop();
            ( this.debug ) && console.debug( "[Debug] Target Name" + ":", Name );

            if ( !Directory && !Socket && !( this.ignore && this.ignore.indexOf( element ) > -1 ) ) {
                try {
                    FS.copyFileSync( Path.join( source, element ), Path.join( target, element ), FS.constants.COPYFILE_FICLONE );

                    /// Only append distribution file(s) upon successful copy
                    this.files.push( String( Path.join( target, element ) ) );

                } catch ( error ) {
                    // ...
                }
            } else {
                if ( !Socket && Directory && !( this.ignore && this.ignore.indexOf( element ) > -1 ) ) {
                    this.copy( Path.join( source, element ), Path.join( target, element ) );
                }
            }
        } );
    }

    /***
     * Shallow Copy
     *
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

    static shallow( source: string, target: string ) {
        FS.readdirSync( source ).forEach( ( element ) => {
            const Target = Path.join( source, element );
            const File = FS.lstatSync( Target, { throwIfNoEntry: true } ).isFile();
            const Descriptor = Path.parse( Target );

            ( File ) && FS.copyFileSync( Path.format( Descriptor ), Path.join( target, Descriptor.base ) );
        } );
    }

    accumulate( target: string ) {
        FS.mkdirSync( target, { recursive: true } );

        FS.readdirSync( target ).forEach( ( element ) => {
            ( this.debug ) && console.debug( "\n" + "[Debug] Element Attribute(s)" + ":", element, "\n" );

            const Directory = FS.lstatSync( Path.join( target, element ), { throwIfNoEntry: true } ).isDirectory();
            const Socket = FS.lstatSync( Path.join( target, element ), { throwIfNoEntry: true } ).isSocket();
            const File = FS.lstatSync( Path.join( target, element ), { throwIfNoEntry: true } ).isFile();

            const Partials = Path.parse( target );
            ( this.debug ) && console.debug( "[Debug] Target Partials" + ":", Partials, "\n" );

            const Name = Partials.dir.split( "/" ).pop();
            ( this.debug ) && console.debug( "[Debug] Target Name" + ":", Name );

            if ( !Directory && !Socket && !this.ignore.includes( element ) ) {
                try {
                    this.compilations.push( String( Path.join( target, element ) ) );
                } catch ( error ) {
                    // ...
                }
            } else {
                if ( !Socket && Directory && !this.ignore.includes( element ) ) {
                    this.accumulate( Path.join( target, element ) );
                }
            }
        } );
    }
}

export { Walker };

export default Walker;