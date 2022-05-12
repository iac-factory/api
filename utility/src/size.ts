import FS from "fs";
import Path from "path";

/***
 * Target Copy Size Calculator
 *
 * Unfortunately it's still not possible to dynamically provide a percentage while the stream is compressing byte-data ...
 *
 * While therefore completely without use and deriving from its intended original purpose, I'm electing to keep
 * as there's some useful code here; checkout the async iterator + nested promise.
 *
 * Perhaps one day I'll finalize a custom implementation of a {@link https://nodejs.org/api/stream.html#class-streampassthrough StreamPassthrough}; the original
 * design for that one was to encrypt byte-streams without the need of a buffer, but through similar intention, calculating the compression status percentage
 * of zip archiving should be much easier in comparison.
 *
 * @param {string} directory
 * @returns {Promise<{Total: number, Statistics: FS.Stats[], Directories: {Total: number}, Files: {Objects: FS.Stats[], Total: number}, Entries: {Total: number}}>}
 * @constructor
 */
const Size = async ( directory: string ): Promise<{ Total: number, Statistics: FS.Stats[], Directories: { Total: number }, Files: { Objects: FS.Stats[], Total: number }, Entries: { Total: number } }> => {
    /// ... mmmm ... definitely needs some clean-up ...
    const Collection: { Total: number, Statistics: FS.Stats[], Directories: { Total: number }, Files: { Objects: FS.Stats[], Total: number }, Entries: { Total: number } } = { Total: 0, Statistics: [], Directories: { Total: 0 }, Files: { Objects: [], Total: 0 }, Entries: { Total: 0 } };

    return new Promise( async ( resolve ) => {
        const $: string[] = await new Promise( ( resolve ) => {
            FS.readdir( directory, { encoding: "utf-8" }, ( error, files ) => {
                if ( error ) throw error;

                resolve( files );
            } );
        } );

        for await ( const iterator of $.map( ( file ) => {
            return new Promise( ( resolve ) => {
                FS.stat( Path.join( directory, file ), ( error, data ) => {
                    if ( error ) throw error;

                    Collection.Files.Total += 1;

                    resolve( data );
                } );
            } );
        } ) ) {
            const $: FS.Stats = iterator as FS.Stats;
            Collection.Statistics.push( $ );
        }

        Collection.Statistics.forEach( ( $ ) => {
            Collection.Total += ( $.size * 1024 * 1024 );
            if ( $.isDirectory() ) {
                Collection.Directories.Total += 1;
            }
        } );

        resolve( Collection );
    } );
};

export { Size };

export default Size;
