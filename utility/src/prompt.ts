/***
 * @author      Jacob B. Sanders
 * @license     BSD 3-Clause License
 * @copyright   Cloud-Technology LLC. & Affiliates
 */

import Process from "process";
import Input from "readline";
import Utility from "util";
import FS from "fs";
import TTY from "tty";

/***
 * User-Input Handler
 * ---
 *
 * @experimental
 * @constructor
 *
 */
const Handler = ( timeout = Handler?.["timeout"], ci = !Handler?.["ci"], debug = Handler?.["debug"]) => {
    (debug) && console.debug("[Debug] Standard-Input Handler" + ":",Utility.inspect(Handler));

    (ci) && process?.stdout?.write( "\u001B[?25l" + "\r" );
    (ci) && process?.stdin?.setRawMode( true );

    process?.stdin?.on("open", () => {
        process?.stdin?.setTimeout(timeout);

        (debug) && console.debug("[Debug] Standard-Input Event Listener(s)" + ":",process?.stdin?.eventNames());
        (debug) && console.debug("[Debug] Standard-Input Input Timeout" + ":",timeout);

        process?.stdin?.on("timeout", () => {
            (debug) && console.debug("[Debug] Standard-Input Timeout Event Trigger");
            (debug) && console.debug("[Debug] Input Stream Never Received Data" + ":",timeout);

//            /// @todo - Better Warning
//            process.emitWarning("Input Stream Never Received Data", {
//                [Symbol.hasInstance]: function ( value: any ): boolean {
//                    return false;
//                }, apply( thisArg: any, argArray: any ): any {
//                }, arguments: undefined, bind( thisArg: any, argArray: any ): any {
//                }, call( thisArg: any, argArray: any ): any {
//                }, caller( p0 ) {
//                }, length: 0, prototype: undefined, toString(): string {
//                    return "";
//                },
//                code: "Prompt-Timeout",
//                name: "Timeout-Exception",
//                detail: "[Warning Detail Information ...]"
//            });
        });
    });

    process?.stdin?.on( "data", ( $ ) => {
        /// Exit if User Inputs := CTRL + C
        /// @ts-ignore
        Buffer.from( [ 0x3 ], "hex" ).equals( $ ) && process?.exit( 0 );

        /// Exit if User Inputs := CTRL + D
        /// @ts-ignore
        Buffer.from( [ 0x4 ], "hex" ).equals( $ ) && process?.exit( 0 );

        /// Exit if User Inputs := CTRL + Z
        /// @ts-ignore
        Buffer.from( [ 0x1a ], "hex" ).equals( $ ) && process?.exit( 0 );
    } );

    process?.on( "exit", (code = 0) => {
        const [ X, Y ] = process?.stdout?.getWindowSize();

        const buffer = " ".repeat( process?.stdout?.columns ) ?? null;

        process?.stdout?.cursorTo( 0, Y );
        process?.stdout?.clearLine( 0 );


        process?.stdout?.write( buffer );

        process?.stdout?.cursorTo( 0, process?.stdout?.rows );
        process?.stdout?.write( "\u001B[?25h" );

        process?.stdout?.emit( "drain" );

        process?.exit(code ? code : 0);
    } );
};

Reflect.set(Handler, "ci", process.env?.["CI"] || !process?.stdin);
Reflect.set(Handler, "timeout", process.env?.["TIMEOUT"] ?? 15000);
Reflect.set(Handler, "interactive", TTY.isatty(process.stdin.fd));
Reflect.set(Handler, "debug", process.argv.map(($) => $.toLowerCase() ?? true).indexOf("--debug") !== -1);

/***
 *
 * @param query
 *
 * @returns {Promise<unknown>}
 *
 * @constructor
 *
 */

const Prompt = async (query) => {
    process?.stdin?.emit("open");
    return new Promise((resolve, reject) => {
        let $;

        const Interface = Input.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: process.stdout.isTTY,
            historySize: 0
        });

        Interface.setPrompt(query);

        Interface.on("line", (data) => {
            $ += data;

            FS.fdatasyncSync(process.stdout.fd);

            Interface.close();
        });

        const prompt = Utility.promisify(Interface.question).bind(Interface);

        try {
            $ = prompt(query);
        } catch (_) { reject(_) }

        resolve($);
    });
};

export { Prompt };

export default Prompt;
