import Utility from "util";
import Subprocess from "child_process";

import { Parse } from "./expression";
import { Remove } from "./remove";

/***
 * `git` Repository Clone Command
 * ---
 *
 * @param repository
 * @param directory
 * @param branch
 *
 * @returns {Promise<void>}
 *
 * @example
 * const Main = async () => {
 *     void await ( async () => new Promise( async (resolve) => {
 *         process.stdout.write( "Importing Dependencies ..." + "\n" );
 *
 *         const { Clone } = await import("./clone");
 *
 *         await Clone("https://github.com/iac-factory/git-clone.git");
 *
 *         resolve(true);
 *     } ) )();
 * };
 *
 * void (async () => Main())();
 *
 * export default Main;
 *
 * export { Main };
 */
export const Spawn = async (repository: string, directory?: string, branch?: string): Promise<boolean> => {
    console.debug( "[Debug] Pulling Repository from VCS ..." );

    const attributes = Parse(repository);

    directory = (directory) ? directory : attributes.name;

    console.debug( "[Debug] Ensuring of Clean File-System ..." );

    await Remove(directory);

    const options = (): readonly [string[]] => {
        console.debug( " - Generating Command Partial(s) ..." );

        const partials = ( branch ) ? [
            "clone", repository, "--branch", branch
        ] : [ "clone", repository ];

        console.debug( " - Determining Local Directory ..." );

        if ( directory != null ) {
            partials.push( directory as string );
        }

        console.debug( " - Replacing Shell Escapes ..." );

        const lexical = partials.join( " " )
            .replace( "$", "" )
            .replace( "{", "" )
            .replace( "}", "" )
            .replace( "(", "" )
            .replace( ")", "" );

        process.stdout.write("\n");

        return [lexical.split( " " )];
    }

    const configuration = options();

    console.debug("[Debug] Command Lexicon", ":=", [ "git", ... configuration], "\n");

    return new Promise( (resolve, reject) => {
        console.log( "[Log] Spawning Non-Interactive \"git\" Clone Sub-Process ..." );

        const subprocess = Subprocess.spawn( "git", ... configuration, {
            shell: false, env: process.env, stdio: "ignore"
        } );

        subprocess.stdout?.on( "data", (chunk) => {
            const buffer = chunk.toString( "utf-8", 0, chunk.length );

            process.stdout.write( buffer );
        } );

        subprocess.stderr?.on( "data", (chunk) => {
            console.error( chunk.toString() );
        } );

        subprocess.on( "message", (message, handle) => {
            console.log( message, handle );
        } );

        subprocess.on( "error", (error) => {
            console.warn( error );

            reject( error );
        } );

        subprocess.on( "exit", (code, handle) => {
            ( code !== 0 ) && reject( { code, handle } );
        } );

        subprocess.on( "close", (code, handle) => {
            ( code !== 0 ) && reject( { code, handle } );

            console.log( " - Successfully Cloned Repository" );

            resolve( true );
        } );
    } );
};

/***
 * `git` Repository Clone Command
 * ---
 *
 * @param repository
 * @param directory
 * @param branch
 *
 * @returns {Promise<void>}
 *
 * @example
 * const Main = async () => {
 *     void await ( async () => new Promise( async (resolve) => {
 *         process.stdout.write( "Importing Dependencies ..." + "\n" );
 *
 *         const { Execute } = await import("./clone");
 *
 *         await Execute("https://github.com/iac-factory/git-clone.git");
 *
 *         resolve(true);
 *     } ) )();
 * };
 *
 * void (async () => Main())();
 *
 * export default Main;
 *
 * export { Main };
 */
export const Execute = async (repository: string, directory?: string, branch?: string) => {
    console.debug( "[Debug] Pulling Repository from VCS ..." );

    const attributes = Parse(repository);

    directory = (directory) ? directory : attributes.name;

    console.debug( "[Debug] Ensuring of Clean File-System ..." );

    await Remove(directory);

    console.debug( "[Debug] Running Promisify on { exec } ..." );

    const command = Utility.promisify(Subprocess.execFile);

    const options = (): readonly string[] => {
        console.debug( " - Generating Command ..." );

        const partials = ( branch ) ? [
            "clone", repository, "--branch", branch
        ] : [ "clone", repository ];

        console.debug( " - Determining Local Directory ..." );

        if ( directory != null ) {
            partials.push( directory as string );
        }

        console.debug( " - Replacing Shell Escapes ..." );

        const lexical = partials.join( " " )
            .replace( "$", "" )
            .replace( "{", "" )
            .replace( "}", "" )
            .replace( "(", "" )
            .replace( ")", "" );

        process.stdout.write("\n");

        return lexical.split(" ");
    }

    const { stdout, stderr } = await command("git", options(), {
        env: process.env,
        cwd: process.cwd(),
        timeout: 30 * 1000,
        shell: false
    });

    console.log(stdout, stderr);

    return stdout;
}

/***
 * `git` Repository Clone Command
 * ---
 *
 * @param repository
 * @param directory
 * @param branch
 *
 * @returns {Promise<void>}
 *
 * @example
 * const Main = async () => {
 *     void await ( async () => new Promise( async (resolve) => {
 *         process.stdout.write( "Importing Dependencies ..." + "\n" );
 *
 *         const { Execute } = await import("./clone");
 *
 *         await Execute("https://github.com/iac-factory/git-clone.git");
 *
 *         resolve(true);
 *     } ) )();
 * };
 *
 * void (async () => Main())();
 *
 * export default Main;
 *
 * export { Main };
 */
export const Command = async (repository: string, directory?: string, branch?: string) => {
    console.debug( "[Debug] Pulling Repository from VCS ..." );

    const attributes = Parse(repository);

    directory = (directory) ? directory : attributes.name;

    console.debug( "[Debug] Ensuring of Clean File-System ..." );

    await Remove(directory);

    console.debug( "[Debug] Running Promisify on { exec } ..." );

    const command = Utility.promisify(Subprocess.execFile);

    const options = (): readonly string[] => {
        console.debug( " - Generating Command ..." );

        const partials = ( branch ) ? [
            "clone", repository, "--branch", branch
        ] : [ "clone", repository ];

        console.debug( " - Determining Local Directory ..." );

        if ( directory != null ) {
            partials.push( directory as string );
        }

        console.debug( " - Replacing Shell Escapes ..." );

        const lexical = partials.join( " " )
            .replace( "$", "" )
            .replace( "{", "" )
            .replace( "}", "" )
            .replace( "(", "" )
            .replace( ")", "" );

        process.stdout.write("\n");

        return lexical.split(" ");
    }

    const { stdout, stderr } = await command("git", options(), {
        env: process.env,
        cwd: process.cwd(),
        timeout: 30 * 1000,
        shell: false
    });

    console.log(stdout, stderr);

    return stdout;
}

export type Executable = {
    (command: string): Subprocess.PromiseWithChild<{
        stdout: string;
        stderr: string;
    }>;
};

export default Spawn;
