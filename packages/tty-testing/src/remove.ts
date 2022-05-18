import FS from "fs";
import Path from "path";

/***
 * Promisified Version of {@link FS.rm}
 * ---
 *
 * Asynchronously, recursively deletes the entire directory structure from target,
 * including subdirectories and files.
 *
 * @experimental
 *
 * @param {string} target
 * @returns {Promise<void>}
 *
 * @constructor
 *
 */
const Remove = async ( target: string ) => {
    const descriptors = async () => new Promise((resolve) => {
        FS.readdir(target, { encoding: "utf-8", withFileTypes: true }, (exception: (NodeJS.ErrnoException | null), files: FS.Dirent[]) => {
            if (exception) throw exception;

            resolve(files.map((descriptor) => Path.join(Path.resolve(target, descriptor.name))));
        });
    });

    const handles = await descriptors();

    console.log(handles);
    //
    // return new Promise( async ( resolve ) => {
    //     ///for await (const descriptor of await descriptors()) {
    //     ///    FS.rm( descriptor.name, { recursive: true, force: true } );
    //     ///}
    //
    //     resolve(true);
    // } );
};

export { Remove };

export default Remove;
