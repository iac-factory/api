import FS from "fs";
import Archiver from "archiver";

/***
 * ZIP Artifact Compression
 * ---
 *
 * @param {string} source
 * @returns {Promise<Set<string>>}
 *
 * @constructor
 */

const Compress = async ( source: string ): Promise<void> => {
    const zip = "nodejs.zip";

    /// const internal = [ "nodejs", "node_modules" ].join( Path.sep );

    const internal = "distribution";

    const archiver = async () => await new Promise<void>( ( resolve ) => {
        const output = FS.createWriteStream( zip );

        const archive = Archiver.create( "zip", {
            zlib: { level: 9 }, comment: "Archive", forceLocalTime: true
        } );

        output.on( "close", () => {
            ///
        } );

        output.on( "end", () => {
            ///
        } );

        archive.on( "warning", ( error ) => {
            throw error;
        } );

        archive.on( "error", ( error ) => {
            throw error;
        } );

        archive.on( "entry", ( entry ) => {
            ///
        } );

        archive.on( "data", ( data ) => {
            ///
        } );

        archive.on( "progress", ( data ) => {
            ///
        } );

        // Pipe Archive data -> File
        archive.pipe( output );

        archive.directory( source, internal );

        archive.finalize().then( () => {
            resolve( null );
        } );
    } );

    await archiver();

    return;
};

export { Compress };
export default Compress;
