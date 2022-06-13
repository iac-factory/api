import Subprocess from "child_process";
import Process from "process";

/***
 * Subprocess Return Type
 */

interface Stream {
    output: string[];

    input: string[];

    error: string[];

    pid: number;

    status: string;

    signal: string;
}

/***
 *
 * Subprocess Spawner
 *
 * @param {string} command - Raw command as a single string
 * @param {string} directory - The spawned subprocess current-working-directory
 * @param {boolean} stdout - Write output to standard-output
 *
 * @returns {Promise<Stream>}
 *
 * @constructor
 *
 */

const Spawn = async (command: string, directory: string = Process.cwd(), stdout: boolean = false) => {
    const Binary = command.split( " " )[0];
    const Arguments = command.split( " " ).splice( 1 );

    const Data: Stream = {
        output: [],
        input: [],
        error: [],

        pid: -1,

        status: "",
        signal: ""
    };

    const Awaitable = new Promise<Stream>( (resolve) => {

        const Command = Subprocess.spawn( Binary, [ ... Arguments ], {
            cwd: directory, env: Process.env, stdio: "pipe", shell: false
        } );

        const Output = Command.stdout;
        const Error = Command.stderr;

        Output.on( "data", ($: Buffer) => {
            const Output = Buffer.from( $ ).toString().split("\n");
            Output.forEach((line) => {
                (line !== "") && Data.output.push( line.trim() );
            });

            (stdout) && Process.stdout.write( Data.output.join("\n") );
        } );

        Error.on( "data", (_) => {
            let Allocation = 0;

            // Allocate an Array Buffer of (n + 1) Bytes
            const Buffer = _;
            Array( Buffer[Symbol.iterator] ).forEach( () => Allocation += 1 );

            // Shift <-- Left to Release Empty Byte for String[0]
            const Output = Buffer.toString();

            Data.error.push( Output );

            (stdout) && Process.stderr.write( Output );

            resolve( Output );
        } );

        Command.on( "error", ($) => {
            Data.pid = Command.pid || 0;
            Data.status = String( $ );
            Data.signal = Command.signalCode || "";

            resolve( Data );
        } );

        Command.on( "exit", ($) => {
            Data.pid = Command.pid || 0;
            Data.status = String( $ );
            Data.signal = Command.signalCode || "";

            resolve( Data );
        } );

        Command.on( "message", ($: Buffer) => {
            const Output = Buffer.from( $ ).toString();
            Data.output.push( Output );

            Process.stderr.write( Output );
        } );

        Command.on( "disconnect", () => {
            Data.pid = Command.pid || 0;
            Data.status = "-1";
            Data.signal = Command.signalCode || "";

            resolve( Data );
        } );

        Command.on( "close", ($) => {
            Data.pid = Command.pid || 0;
            Data.status = String( $ );
            Data.signal = Command.signalCode || "";

            resolve( Data );
        } );
    } );

    return await Awaitable;
};

export { Spawn };

export default Spawn;
