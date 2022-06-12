/*
 * BSD 3-Clause License
 *
 * Copyright © 2022, Jacob B. Sanders, IaC-Factory & Affiliates
 *
 * All Rights Reserved
 */

import OS from "os";
import Utility from "util";
import ANSI from "ansi-colors";

export module Debugger {
    enum Level {
        Debug = "debug",
        Informational = "info",
        Warning = "warn",
        Error = "error"
    }

    /***
     *
     * @param {Debugger.Depth} depth
     * @returns {Debugger.Depth & Number}
     * @constructor
     */
    const Depth = (depth: Depth = 1) => {
        return ( typeof depth === "number" ) ? depth : ( depth === "Infinity" ) ? Infinity : 1;
    };

    enum Color {
        black = "black",
        red = "red",
        green = "green",
        yellow = "yellow",
        blue = "blue",
        magenta = "magenta",
        cyan = "cyan",
        white = "white",
        gray = "gray",
        grey = "grey"
    }

    export type Colors = keyof typeof Color;
    export type Levels = keyof typeof Level;

    export type Depth = 1 | 5 | 10 | 15 | 25 | 50 | "Infinity";

    export interface Input {
        /***
         * The Calling Package's Interface, or Module
         *
         * @typeof [module {@link String}, color {@link Colors}]
         *
         * @example
         * ["Routing", "magenta"]
         * */
        module: [ string, Colors ],
        /***
         * The Debugger Log-Level, and Color for the Logging Enumeration
         *
         * @typeof [log-level {@link Levels}, color {@link Colors}]
         *
         * @example
         * ["Debug", "gray"]
         * */
        level: [ Levels, Colors ],
        /***
         * Depth for Output, and whether Output should be Sorted Alphabetically
         *
         * @typeof [depth {@link Depth}, sorting {@link Boolean}]
         *
         * @example
         * [1, true]
         *
         * @example
         * ["Infinity", false]
         * */
        depth: [ Depth, boolean ]
    }

    export class Logger implements Type {
        debug: Type["debug"];
        info: Type["info"];
        warn: Type["warn"];
        error: Type["error"];

        private depth: number;
        private sorting: boolean;
        private input: Input;

        private readonly context: string;

        private color = ANSI.create();

        private prefix = {
            debug: [ "[", this.color.bold.cyan( "Debug" ), "]" ].join( "" ),
            info: [ "[", this.color.bold.blue( "Informational" ), "]" ].join( "" ),
            warn: [ "[", this.color.bold.yellow( "Warning" ), "]" ].join( "" ),
            error: [ "[", this.color.bold.red( "Error" ), "]" ].join( "" ),
            log: [ "[", this.color.bold.green( "Log" ), "]" ].join( "" )
        };

        private colorize: (context?: string) => string;

        constructor(settings: Input) {
            this.input = settings;

            const logger = ( settings.level[ 0 ] === "Debug" ) ? Logger.debug( this )
                : ( settings.level[ 0 ] === "Informational" ) ? Logger.info( this )
                    : ( settings.level[ 0 ] === "Warning" ) ? Logger.warn( this )
                        : Logger.error( this );

            this.context = this.input.module[ 0 ];
            this.colorize = (context = this.context) => "[" + Reflect.get( this.color, this.input.module[ 1 ] )( context ) + "]";

            this.depth = Depth( this.input.depth[ 0 ] );
            this.sorting = this.input.depth[ 1 ];

            this.debug = logger.debug;
            this.info = logger.info;
            this.warn = logger.warn;
            this.error = logger.error;
        }

        private static debug(instance: Logger) {
            return {
                debug: (input: object | string) => {
                    console.log( instance.colorize(), instance.prefix.debug, Utility.inspect( ( typeof input === "string" ) ? input : { ... input }, {
                        colors: true,
                        sorted: instance.sorting,
                        depth: instance.depth,
                        compact: true
                    } ) );
                },
                info: (input: object | string) => {
                    console.log( instance.context, instance.prefix.info, Utility.inspect( ( typeof input === "string" ) ? input : { ... input }, {
                        colors: true,
                        sorted: instance.sorting,
                        depth: instance.depth,
                        compact: true
                    } ) );
                },
                warn: (input: object | string) => {
                    console.log( instance.context, instance.prefix.warn, Utility.inspect( ( typeof input === "string" ) ? input : { ... input }, {
                        colors: true,
                        sorted: instance.sorting,
                        depth: instance.depth,
                        compact: true
                    } ) );
                },
                error: (input: object | string) => {
                    console.log( instance.context, instance.prefix.error, Utility.inspect( ( typeof input === "string" ) ? input : { ... input }, {
                        colors: true,
                        sorted: instance.sorting,
                        depth: instance.depth,
                        compact: true
                    } ) );
                }
            };
        }

        private static info(instance: Logger) {
            return {
                debug: () => OS.devNull,
                info: (input: object | string) => {
                    console.log( instance.context, instance.prefix.info, Utility.inspect( ( typeof input === "string" ) ? input : { ... input }, {
                        colors: true,
                        sorted: instance.sorting,
                        depth: instance.depth,
                        compact: true
                    } ) );
                },
                warn: (input: object | string) => {
                    console.log( instance.context, instance.prefix.warn, Utility.inspect( ( typeof input === "string" ) ? input : { ... input }, {
                        colors: true,
                        sorted: instance.sorting,
                        depth: instance.depth,
                        compact: true
                    } ) );
                },
                error: (input: object | string) => {
                    console.log( instance.context, instance.prefix.error, Utility.inspect( ( typeof input === "string" ) ? input : { ... input }, {
                        colors: true,
                        sorted: instance.sorting,
                        depth: instance.depth,
                        compact: true
                    } ) );
                }
            };
        }

        private static warn(instance: Logger) {
            return {
                debug: () => OS.devNull,
                info: () => OS.devNull,
                warn: (input: object | string) => {
                    console.log( instance.context, instance.prefix.warn, Utility.inspect( ( typeof input === "string" ) ? input : { ... input }, {
                        colors: true,
                        sorted: instance.sorting,
                        depth: instance.depth,
                        compact: true
                    } ) );
                },
                error: (input: object | string) => {
                    console.log( instance.context, instance.prefix.error, Utility.inspect( ( typeof input === "string" ) ? input : { ... input }, {
                        colors: true,
                        sorted: instance.sorting,
                        depth: instance.depth,
                        compact: true
                    } ) );
                }
            };
        }

        private static error(instance: Logger) {
            return {
                debug: () => OS.devNull,
                info: () => OS.devNull,
                warn: () => OS.devNull,
                error: (input: object | string) => {
                    console.log( instance.context, instance.prefix.error, Utility.inspect( ( typeof input === "string" ) ? input : { ... input }, {
                        colors: true,
                        sorted: instance.sorting,
                        depth: instance.depth,
                        compact: true
                    } ) );
                }
            };
        }
    }

    /***
     * Debugger
     * ---
     * @returns {Logger}
     * @param settings
     */
    export function hydrate(settings: Input) {
        return new Logger( settings );
    }

    export interface Type {
        debug: (input: object | string) => void;
        info: (input: object | string) => void;
        warn: (input: object | string) => void;
        error: (input: object | string) => void;
    }

    export type Types = keyof Type;
}

export default function (settings: Debugger.Input) {
    return Debugger.hydrate(settings);
}
