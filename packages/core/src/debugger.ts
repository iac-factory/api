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
        return ( typeof depth === "number" ) ? depth : (depth === "Infinity") ? Infinity : 1;
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

    type Colors = keyof typeof Color;
    type Levels = keyof typeof Level;

    type Depth = 1 | 5 | 10 | 15 | 25 | 50 | "Infinity";

    export interface Input {
        /***
         * The Caller Package, or Abstract Module
         *
         * @typeof [package {@link String}, color {@link Colors}]
         *
         * @example
         * ["API-Services", "blue"]
         * */
        namespace: [ string, Colors ],
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

    /***
     * Debugger
     * ---
     * @returns {Logger}
     * @param settings
     */
    export function hydrate(settings: Input) {
        /*** @private */
        class Logger implements Type {
            debug: Type["debug"];
            info: Type["info"];
            warn: Type["warn"];
            error: Type["error"];
            log: Type["log"];

            private namespace = {
                name: settings.namespace[ 0 ],
                color: settings.namespace[ 1 ],
                constructor: (instance: Logger) => [
                    "[",
                    ( Reflect.get(
                        instance.color.bold,
                        instance.namespace.color )
                    (
                        ( instance.namespace.name )
                    ) ),
                    "]"
                ].join( "" )
            };

            private module = {
                name: settings.module[ 0 ],
                color: settings.module[ 1 ],
                constructor: (instance: Logger) => [
                    "[",
                    ( Reflect.get(
                        instance.color.bold,
                        instance.module.color )
                    (
                        ( instance.module.name )
                    ) ),
                    "]"
                ].join( "" )
            };

            private constructors = (local?: string) => {
                const namespace = "[" + ( Reflect.get( this.color.bold, this.namespace.color )( ( this.namespace.name ) ) ) + "]";
                const module = "[" + ( Reflect.get( this.color.bold, this.module.color )( ( ( local ) ? local : this.module.name ) ) ) + "]";

                return [ namespace, module ];
            };

            private depth = Depth( settings.depth[ 0 ] );
            private sorting = settings.depth[ 1 ];

            private color = ANSI.create();

            private prefix = {
                debug: [ "[", this.color.bold.cyan( "Debug" ), "]" ].join( "" ),
                info: [ "[", this.color.bold.blue( "Informational" ), "]" ].join( "" ),
                warn: [ "[", this.color.bold.yellow( "Warning" ), "]" ].join( "" ),
                error: [ "[", this.color.bold.red( "Error" ), "]" ].join( "" ),
                log: [ "[", this.color.bold.green( "Log" ), "]" ].join( "" )
            };

            private header = (overwrite?: string) => {
                return {
                    debug: [ ... this.constructors( overwrite ), this.prefix.debug ].join( " " ),
                    info: [ ... this.constructors( overwrite ), this.prefix.info ].join( " " ),
                    warn: [ ... this.constructors( overwrite ), this.prefix.warn ].join( " " ),
                    error: [ ... this.constructors( overwrite ), this.prefix.error ].join( " " ),
                    log: [ ... this.constructors( overwrite ), this.prefix.log ].join( " " )
                };
            };

            constructor() {
                const logger = ( settings.level[ 0 ] === "Debug" ) ? Logger.debug( this )
                    : ( settings.level[ 0 ] === "Informational" ) ? Logger.info( this )
                        : ( settings.level[ 0 ] === "Warning" ) ? Logger.warn( this )
                            : Logger.error( this );

                this.debug = logger.debug;
                this.info = logger.info;
                this.warn = logger.warn;
                this.error = logger.error;

                this.log = Reflect.get( logger, settings.level[ 0 ] );
            }

            private static debug(instance: Logger) {
                return {
                    debug: ($: any, module?: string, depth?: Depth, sorting?: boolean) => {
                        console.log( instance.header( module ).debug, Utility.inspect( (typeof $ === "string") ? $ : { ... $ }, {
                            colors: true,
                            sorted: ( sorting ) ? sorting : instance.sorting,
                            depth: ( depth ) ? Depth(depth) : instance.depth
                        } ) )
                    },
                    info: ($: any, module?: string, depth?: Depth, sorting?: boolean) => console.log( instance.header( module ).info, Utility.inspect( (typeof $ === "string") ? $ : { ... $ }, {
                        colors: true,
                        sorted: ( sorting ) ? sorting : instance.sorting,
                        depth: ( depth ) ? Depth(depth) : instance.depth,
                        showHidden: true
                    } ) ),
                    warn: ($: any, module?: string, depth?: Depth, sorting?: boolean) => console.log( instance.header( module ).warn, Utility.inspect( (typeof $ === "string") ? $ : { ... $ }, {
                        colors: true,
                        sorted: ( sorting ) ? sorting : instance.sorting,
                        depth: ( depth ) ? Depth(depth) : instance.depth,
                        showHidden: true
                    } ) ),
                    error: ($: any, module?: string, depth?: Depth, sorting?: boolean) => console.log( instance.header( module ).error, Utility.inspect( (typeof $ === "string") ? $ : { ... $ }, {
                        colors: true,
                        sorted: ( sorting ) ? sorting : instance.sorting,
                        depth: ( depth ) ? Depth(depth) : instance.depth,
                        showHidden: true
                    } ) )
                };
            }

            private static info(instance: Logger) {
                return {
                    debug: () => OS.devNull,
                    info: ($: any, module?: string, depth?: Depth, sorting?: boolean) => console.log( instance.header( module ).info, Utility.inspect( (typeof $ === "string") ? $ : { ... $ }, {
                        colors: true,
                        sorted: ( sorting ) ? sorting : instance.sorting,
                        depth: ( depth ) ? Depth(depth) : instance.depth,
                        showHidden: true,
                    } ) ),
                    warn: ($: any, module?: string, depth?: Depth, sorting?: boolean) => console.log( instance.header( module ).warn, Utility.inspect( (typeof $ === "string") ? $ : { ... $ }, {
                        colors: true,
                        sorted: ( sorting ) ? sorting : instance.sorting,
                        depth: ( depth ) ? Depth(depth) : instance.depth,
                        showHidden: true
                    } ) ),
                    error: ($: any, module?: string, depth?: Depth, sorting?: boolean) => console.log( instance.header( module ).error, Utility.inspect( (typeof $ === "string") ? $ : { ... $ }, {
                        colors: true,
                        sorted: ( sorting ) ? sorting : instance.sorting,
                        depth: ( depth ) ? Depth(depth) : instance.depth,
                        showHidden: true
                    } ) )
                };
            }

            private static warn(instance: Logger) {
                return {
                    debug: () => OS.devNull,
                    info: () => OS.devNull,
                    warn: ($: any, module?: string, depth?: Depth, sorting?: boolean) => console.log( instance.header( module ).warn, Utility.inspect( (typeof $ === "string") ? $ : { ... $ }, {
                        colors: true,
                        sorted: ( sorting ) ? sorting : instance.sorting,
                        depth: ( depth ) ? Depth(depth) : instance.depth,
                        showHidden: true
                    } ) ),
                    error: ($: any, module?: string, depth?: Depth, sorting?: boolean) => console.log( instance.header( module ).error, Utility.inspect( (typeof $ === "string") ? $ : { ... $ }, {
                        colors: true,
                        sorted: ( sorting ) ? sorting : instance.sorting,
                        depth: ( depth ) ? Depth(depth) : instance.depth,
                        showHidden: true
                    } ) )
                };
            }

            private static error(instance: Logger) {
                return {
                    debug: () => OS.devNull,
                    info: () => OS.devNull,
                    warn: () => OS.devNull,
                    error: ($: any, module?: string, depth?: Depth, sorting?: boolean) => console.log( instance.header( module ).error, Utility.inspect( (typeof $ === "string") ? $ : { ... $ }, {
                        colors: true,
                        sorted: ( sorting ) ? sorting : instance.sorting,
                        depth: ( depth ) ? Depth(depth) : instance.depth,
                        showHidden: true
                    } ) )
                };
            }
        }

        return new Logger();
    }

    export interface Type {
        debug: ($: any, module?: string, depth?: Depth, sorting?: boolean) => void;
        info: ($: any, module?: string, depth?: Depth, sorting?: boolean) => void;
        warn: ($: any, module?: string, depth?: Depth, sorting?: boolean) => void;
        error: ($: any, module?: string, depth?: Depth, sorting?: boolean) => void;

        log: ($: any, module?: string, depth?: Depth, sorting?: boolean) => void;
    }

    export type Types = keyof Type;
}

export default Debugger;