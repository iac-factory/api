import FS from "fs";
import Path from "path";
import Process from "process";

import Assertion from "assert";

import { Debugger } from "@iac-factory/api-core";

/***
 * Environment Variable(s) File Parser
 * ---
 *
 * - Please note that the following implementation hasn't been tested in significance.
 *
 * @extends {Array, Variables}
 *
 * Allows the ability to parse a dot-env of equal or similar malformations (see below)
 *
 * @example
 * ... `.env`
 *
 * /// Alpha=true
 * /// BRAVO="ABC"
 * /// charlie="brown
 * /// delta = "hello, i am spaced"
 * /// export echo="test-123"
 * /// FoXtrOT=false
 * /// GAMMA="${GLOBAL_VARIABLE}"
 * /// Hotel="heeeeelp meeeee" # Test Hello World
 *
 * const environment = Environment.construct(".env");
 */

export class Environment extends Object {
    protected internal: {
        file: string | FS.PathLike;
        path: string;
        valid: boolean;
        cwd: string;
    };

    private constructor(file: string | FS.PathLike, strict: boolean = true) {
        super();

        this.internal = {
            cwd: Process.cwd(),
            file: String( file ),
            path: Path.resolve( process.cwd(), file as string ),
            valid: FS.existsSync( Path.resolve( process.cwd(), file as string ) )
        };

        ( strict ) && this.assert();
    }

    private assert() {
        Assertion.equal( this.internal.valid, true, "Unable to Locate Dot-Environment File" + ":" + " " + this.internal.path );
    }

    /***
     * String Bash Operation Symbols from Key-Value Pair
     * ---
     * @param {string} variable - The "Key" in `Key="Value"`
     *
     * @private
     *
     * @example
     *
     * /// .env
     * declare test=true
     *
     * # --> Becomes ...
     * # "test"
     *
     */

    private static key(variable: string) {
        const key = String( variable );
        const split = key.split( " " );
        const evaluation = ( split.length > 1 );

        const joiner = split.join( "" );

        const local = ( evaluation ) ? joiner.replaceAll( RegExp( ".*(local).*", "igm" ), "" ) : joiner;
        const declare = ( evaluation ) ? local.replaceAll( RegExp( ".*(declare).*", "igm" ), "" ) : local;

        return ( evaluation ) ? declare.replaceAll( RegExp( ".*(export).*", "igm" ), "" ) : declare;
    }

    /***
     * Split Key-Value Pair
     * ---
     *
     * @param {string} line
     *
     * @returns {string[]}
     *
     * @private
     *
     */

    private static split(line: string): string[] {
        return line.split( "=" );
    }

    /***
     * Strip Inline Comment
     * ---
     *
     * @param {[string, string] | [string] | string[]} array
     *
     * @returns {[string, string]}
     *
     * @private
     *
     */

    private static comment(array: [ string, string ] | [ string ] | string[]) {
        if ( array[ 1 ] && array[ 1 ].split( "#" ).length > 1 ) {
            return [ array[ 0 ], array[ 1 ].split( "#" )[ 0 ] ];
        } else {
            return array;
        }
    }

    /***
     * Compute the Key-Value(s)
     * ---
     *
     * @returns {Promise<Environment>}
     *
     */

    private async hydrate(): Promise<Environment> {
        return new Promise( (resolve, reject) => {
            if ( !FS.existsSync( this.internal.file ) ) reject();

            FS.readFile( this.internal.file, { encoding: "utf-8" }, (error: NodeJS.ErrnoException | null, data: string) => {
                    if ( error ) reject( error );
                    const set: Pair = data.trim().split( "\n" ).filter( ($) => {
                        return ( $ !== "\n" && $ !== "" );
                    } ).map( (line) => {
                        const split = Environment.split( line );
                        return Environment.comment( split );
                    } ).reduce(
                        (accumulation: Pair, [ key, value ]) => {
                            return {
                                ... accumulation,
                                [ String( key ) ]: value
                            };
                        }, {}
                    );

                    console.log("Set", set);

                    for (const [variable, assignment] of Object.entries(set)) {
                        const mutator: object & { variable: string, assignment?: string } = { variable, assignment };

                        const clean = (input: string) => {
                            input = (input) ? input : "";

                            input = input.trim();

                            input = input.replace( "\n", "" );
                            input = input.replace( "\"", "" );
                            input = input.replace( "\"", "" );

                            /// Don't need "{" or "}" for variable expansion; it's just
                            /// a bash best-practice for readability and, well, expansion.

                            input = input.replace( "{", "" );
                            input = input.replace( "}", "" );

                            /*** @todo - Update once `resolve()` is implemented */
                            input = input.replace("$", "");

                            return input;
                        };

                        /***
                         * And now I'm realizing the complexity behind bash variable expansion...
                         *  - While certainly complex, I have a solution
                         *  - I'll be revisiting this at another time
                         *
                         * @param {string} input
                         *
                         * @todo - Implement `resolve` Function
                         */
                        const resolve = (input: string) => {
                            const resolver: object & {variable: string; assignment: string} = {variable: "", assignment: ""};

                            if (input.includes("$")) {
                                resolver.variable = input.replace("$", "");
                                resolver.assignment = Reflect.get(set, resolver.variable);

                                if (resolver.assignment.includes("$")) {
                                    resolver.assignment = resolver.assignment.replace("$", "");

                                    resolver.assignment = Reflect.get(set, resolver.assignment);
                                }
                            }
                        }

                        mutator.variable = clean(mutator.variable);
                        mutator.assignment = Reflect.get( set, variable );

                        console.log("Test", mutator.assignment);

                        mutator.assignment = (mutator.assignment) ? clean(mutator.assignment) : mutator.assignment;

                        const assessment: Assignment = {
                            Key: mutator.variable,
                            Value: mutator.assignment ?? null
                        };

                        console.log(assessment);
                    }

                    Object.keys( set ).forEach( (variable) => {
                        const value = Environment.key( variable );

                        if ( value !== "" ) {
                            const base = Reflect.get( set, String( variable ) );

                            const quote = base?.replace( "\n", "" ).trim();
                            const normalize = quote?.replace( "\"", "" ).replace( "\"", "" );
                            const escape: string | undefined = normalize?.replace( "$", "" ).replace( "{", "" ).replace( "}", "" );

                            const assignment: Assignment = {
                                Key: value,
                                Value: escape ?? null
                            };

                            console.log( assignment );

                            Reflect.set(this, variable, {
                                Key: value,
                                Value: escape
                            });
                        }
                    } );

                    resolve( this );
                }
            );
        } );
    }

    public debug() {
        const logger = Debugger.hydrate( {
            depth: [ 1, true ],
            level: [ "Debug", "cyan" ],
            module: [ "Main", "magenta" ],
            namespace: [ "API", "red" ]
        } );

        logger.debug( this );
    }

    public static async construct(file: string) {
        const instance = new Environment( file );

        return instance.hydrate();
    }

    public export() {
        // const file = FS.openSync(this.internal.file, "w", 0o666);

        const lines: string[] = [];
        for ( const [ key, assignment ] of Object.entries( this ) ) {
            const t = `${ key }="${ assignment[ "Value" ] }"`;
            lines.push( t );
        }

        console.log( lines );
    }
}

export interface Variable {
    Key: string;
    Value: string;
}

export type Pair = { [ $: string ]: string | undefined };
export type Assignment = { [ $: string ]: string | null };

export type Variables = Variable[];

export default Environment as Object;