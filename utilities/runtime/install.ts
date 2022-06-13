/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import { Strip } from ".";

import FS from "fs";
import Spawn from "child_process";
import Path from "path";

const CWD = __dirname;

const Writer = async (chunk: Buffer | string | string[], strip: boolean = false) => {
    const buffer = chunk.toString( "utf-8", 0, chunk.length );

    chunk = buffer.split( "\n" );

    chunk.forEach( (line) => {
        line = line.trim();
        ( line !== "" ) && new Promise((resolve, reject) => {
            process.stdout.write( ANSI.white( "[" + "Writer" + "]" ) + " >>> " + ( ( strip ) ? Strip( line ) : line) + "\n", "utf-8", (exception) => {
                if (exception) reject(exception);

                resolve(() => FS.fdatasyncSync(process.stdout.fd));
            } );
        });
    } );
};

const PKG = Path.dirname( Path.resolve( Path.dirname( CWD ) ) );

import ANSI from "ansi-colors";

/***
 * Install *ALL* Dependencies
 * ---
 * `devDependencies` are required at this stage in order to compile the
 * typescript down to aws-lambda compliant javascript.
 *
 * @param {string} command
 * @param {(string | string)[]} args
 * @param {string} cwd
 * @param {boolean} ignore
 * @returns {Promise<boolean>}
 *
 * @constructor
 */
export async function Install(command: string = "npx", args: ( string | string )[] = [ "bash", "test.bash" ], cwd: string = PKG): Promise<NodeJS.ErrnoException | void> {
    return new Promise<NodeJS.ErrnoException | boolean | void>( (resolve, reject) => {
        const subprocess = Spawn.spawn( command, args, {
            shell: false, env: process.env, cwd: cwd, stdio: "pipe"
        } );

        subprocess.stdout?.on( "data", Writer);
        subprocess.stderr?.on( "data", Writer);

        subprocess.on( "error", (error: NodeJS.ErrnoException) => {
           reject( error );
        } );

        subprocess.on( "exit", (code: number, handle: any) => {
            ( code !== 0 ) && reject( { code, handle } );
        } );

        subprocess.on( "close", (code: number, handle: any) => {
            ( code !== 0 ) && reject( { code, handle } ) || resolve( true );
        } );
    } ).catch((exception) => exception);
}

export default Install;

