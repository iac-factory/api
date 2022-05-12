import FS from "fs";
import Module from "module";

import type { Handler } from "./handler";

const Import = Module.createRequire( __filename );

async function test() {
    const unified = import("unified");
    const remarkParse = import("remark-parse");
    const remarkRehype = import("remark-rehype");
    const rehypeSanitize = import("rehype-sanitize");
    const rehypeStringify = import("rehype-stringify");

    const file = (await unified).default.unified()
        .use( (await remarkParse).default )
        .use( (await remarkRehype).default )
        .use( (await rehypeSanitize).default )
        .use( (await rehypeStringify).default )
        .process( "# Hello, Neptune!" );

    console.log( String( file ) );
}

type Exception = NodeJS.ErrnoException;

/***
 * See the Error-based {@link Handler.Type} and {@link Handler.Return} type(s) for additional information.
 *
 * @param {Handler.Descriptor} descriptor
 * @param {boolean} raise
 * @param mode {Handler.Modes}
 *
 * @returns {Handler.Existence | Handler.Return}
 *
 * @constructor
 *
 * @example
 * /// Simplified Default Usage
 * const doesFileExist: boolean = await File("./definitely-existing-file-descriptor.txt");
 *
 * @example
 * /// Additional Verbosity with Object Return Type
 * const file = !( await File( "file.txt", false, "object" ) );
 *
 * @example
 * /// Basically a Existence Assertion
 * await File("~/.file-descriptor", true);
 *
 */
const Evaluator = async (descriptor: FS.PathOrFileDescriptor, raise: boolean = false, mode: Handler.Modes = "default"): Promise<Handler.Content | Handler.Return> => {
    return new Promise( (resolve, reject) => {
        FS.readFile( descriptor, { encoding: "utf-8" }, (error, content) => {
            if ( error ) {
                const caught = "ENOENT";
                const message = ( error.code == caught ) ? "File Not Found"
                    : "Unknown Error";
                const location = error.path;

                const throwable = JSON.stringify( {
                    File: descriptor,
                    Code: error.code,
                    System: error.syscall,
                    Message: message,
                    Location: location
                }, null, 4 );

                if ( error.code === caught && raise ) {
                    throw new Error( throwable );
                } else {
                    if ( !raise ) {
                        resolve( ( mode === "object" ) ? JSON.parse( throwable ) : false );
                    }
                }

                reject( throwable );
            }

            resolve( content );
        } );
    } );
};

const Reader = async (file: FS.PathLike): Promise<string | boolean | Exception | PromiseLike<string | Exception>> => {
    return new Promise( (resolve, reject) => {
        FS.open( file, "r", (error: Exception | null, descriptor) => {
            if ( ( error ) && error.code === "ENOENT" ) {
                console.debug( "[Debug]", "[Controller]", "[MDX]", "File Not Found", ":=", file );

                resolve( false );
            } else {
                if ( error ) throw error;
            }

            Evaluator( descriptor, true )
                .then( (content) => resolve( content as string ) )
                .catch( (error) => reject( error ) )
                .finally( () => FS.close( descriptor, (error) => {
                    if ( error ) throw error;
                } ) );
        } );
    } );
};

const Content = async (file: FS.PathLike) => Reader( file );

export const Markdown = async (file: FS.PathLike) => {
    // const content = await Content( file );

    // const { VFile: V } = await import("vfile");
    //
    // const exportable = await compile(content as string);

    return test();

    // return (typeof content == "string") ? String(await pkg.evaluate(content, {
    //     Fragment: "article",
    //     jsx: null,
    //     jsxs: null,
    //     format: "md",
    //     baseUrl: process.cwd(),
    //     development: true
    // })) : null;
};
