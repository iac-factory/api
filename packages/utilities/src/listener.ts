/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import Process from "process";
import Subprocess from "child_process";

export type PWD = string | URL | undefined;
/*** The Working Directory for the Spawn'd Process - Defaults via Invocation's CWD */
export type CWD = string | URL | undefined | PWD;
/*** The Spawn'd Process Environment Variables - Defaults via Runtime's Configuration */
export type Environment = typeof process["env"];
/*** Process Buffer + Stream Type - Defaults to `"pipe"` */
export type IO = "pipe" | "ignore";
/*** Detach Runtime from Spawn Process - Defaults to `false` */
export type Detachment = false | boolean;
/*** Process Timeout (Milliseconds) - Defaults to `Infinity` */
export type Timeout = number;
/*** Spawn an Interactive Subshell for Process - Defaults to `false` */
export type Shell = false | boolean

/***
 * Spawn Options
 * ---
 *
 * Opinionated Defaults:
 * - Security (Disabling `shell`)
 * - Control (Buffers `stdio`)
 * - Configuration (Inherits `process.env`)
 *
 * See {@link Subprocess.ChildProcess} for Additional Details.

 * @param {Options} options
 * @param environment
 * @constructor
 */
export function Spawn(this: any, options: Options, environment?: object | NodeJS.ProcessEnv): () => Promise<Subprocess.ChildProcessWithoutNullStreams> {
    if ( !( ( this ) instanceof Spawn ) ) {
        return Reflect.construct( Spawn, [ options ] );
    }

    const defaults: Options = {
        application: options.application,
        parameters: options.parameters,
        cwd: Process.cwd(),
        detached: false,
        env: environment as NodeJS.ProcessEnv ?? {} as NodeJS.ProcessEnv,
        shell: false,
        stdio: "pipe",
        timeout: 0
    } as const;

    /*** @type {{readonly detached: Detachment, readonly cwd: CWD, readonly stdio: IO, readonly shell: Shell, readonly env: Environment, readonly timeout: Timeout}} */
    const configuration = ( options ) ? { ... defaults, ... options } : defaults;

    /***
     * Interface
     * ---
     *
     * @param parameters
     * @param properties
     */
    const spawn = async function (parameters: Parameters, properties = configuration): Promise<string | NodeJS.ErrnoException> {
        return new Promise( (resolve, reject) => {
            const data = Object.create( {} );

            const subprocess = Subprocess.spawn( configuration.application, parameters, properties as Subprocess.SpawnOptions );

            subprocess.on( "error", (error) => {
                reject( [ error, data ] );
            } );

            /***
             * Output often contains more than a single empty line to use as separation contexts.
             *
             * The following filter aims to eliminate useless output; consecutive empty lines are limited to
             * a single line.
             */
            subprocess?.stdout?.on( "data", async (output: Buffer | string[]) => {
                output = Filters.empty(output);

                console.log();

                for await ( const line of output ) {
                    void await new Promise( (resolve) => {
                        process.stdout.write(
                            "[Test]" + " " + line + "\n", (exception) => {
                                if ( exception ) throw exception;

                                resolve( null );
                            }
                        );
                    } );
                }
            } );

            subprocess?.stderr?.on( "data", (output: Buffer) => {
                data.error += ( output.toString( "utf-8" ) );
            } );

            subprocess.on( "close", (code: number) => {
                ( code === 0 ) && resolve( data.output );
                ( code === 0 ) || reject( data );
            } );
        } );
    };

    function command(): Promise<Subprocess.ChildProcessWithoutNullStreams> {
        const reference = Object.create( {} );

        reference.spawn = spawn;

        return reference.spawn( options.parameters, options );
    }

    Object.setPrototypeOf( command, this );

    return command;
}

/**
 * Proxy Prototype-based Inheritance
 * ---
 * @experimental
 */
Spawn.prototype = Spawn;
Spawn.prototype.constructor = new Proxy( Spawn.prototype, {} );

/**
 * Application Binary Interface
 * <br>
 * @example
 * "ls"
 *
 * @example
 * "node"
 */
export type File = string;

export type Parameters = string[]

export type Construct = Function["prototype"];

export type Options = {
    /*** {@link File} */
    readonly application: File;
    /*** {@link Parameters} */
    parameters?: Parameters;
    /*** {@link Detachment} */
    readonly detached?: Detachment;
    /*** {@link CWD} */
    readonly cwd?: CWD;
    /*** {@link Environment} */
    readonly env?: Environment;
    /*** {@link Shell} */
    readonly shell?: Shell;
    /*** {@link IO} */
    readonly stdio?: IO;
    /*** {@link Timeout} */
    readonly timeout?: Timeout;
}

export const Filters = {
    empty: function (input: Buffer | string[]) {
        input = input.toString( "utf-8" ).split( "\n" );
        input = input.filter( (value, index, array) => {
            return !( value.trim() === "" && ( array[ index + 1 ]?.trim() === "" || !!( array[ index + 1 ] ) ) );
        } );

        return input;
    }
} as const;

/*** Module Testing */
void ( async () => {
    const debug = ( process.argv.includes( "--debug" ) && process.argv.includes( "--spawn" ) );

    const test = async () => {
        const { Spawn } = await import(".");

        const output = Spawn({ application: "ls" });

        const data = { output };

        console.log( data );
    };

    ( debug ) && await test();
} )();
