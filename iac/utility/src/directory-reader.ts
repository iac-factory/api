import FS from "fs";
import Path from "path";

/***
 * Promisified Version of {@link FS.readdir}
 * ---
 *
 * Asynchronously, reads the contents of a directory.
 *
 * The callback gets two arguments (`'err'`, `'files'`) where `'files'`
 * is an array of the names of the files in the directory excluding '.' and '..'.

 * The optional options argument can be a string specifying an encoding, or an object with an encoding
 * property specifying the character encoding to use for the filenames passed to the callback. If the encoding
 * is set to 'buffer', the filenames returned will be passed as Buffer objects.
 *
 * If options.withFileTypes is set to true, the files array will contain {@link fs.Dirent} objects.
 *
 * @experimental
 *
 * @param {string} target
 * @returns {Promise<void>}
 *
 * @constructor
 *
 */
const Reader = async ( target: string ) => {
    /***
     * Asynchronously computes the canonical pathname by resolving `.`, `..` and
     * symbolic links.
     *
     * <br/>
     *
     * A canonical pathname is not necessarily unique. Hard links and bind mounts can
     * expose a file system entity through many pathnames.
     *
     * <br/>
     *
     * This function behaves like [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3.html), with some exceptions:
     *
     * 1. No case conversion is performed on case-insensitive file systems.
     * 2. The maximum number of symbolic links is platform-independent and generally
     * (much) higher than what the native [`realpath(3)`](http://man7.org/linux/man-pages/man3/realpath.3.html) implementation supports.
     *
     * <br/>
     *
     * The `callback` gets two arguments `(err, resolvedPath)`. May use `process.cwd`to resolve relative paths.
     *
     * <br/>
     * <br/>
     *
     * Only paths that can be converted to UTF8 strings are supported.
     *
     */
    const valid = () => {
        return new Promise((resolve) => FS.realpath(target, { encoding: "utf-8" }, (exception, path) => {
            resolve((exception) ? false : !!( path ));
        } ));
    };

    const descriptors: Descriptors = async () => new Promise((resolve) => {
        const handle: Handler = (exception, files) => {
            const descriptors = files.map((descriptor) => Path.join(Path.resolve(target, descriptor.name)));

            resolve(descriptors);
        };

        void FS.readdir(target, { encoding: "utf-8", withFileTypes: true }, handle);
    });

    return (await valid()) ? await descriptors() : null;
};

export type Descriptors = () => Promise<FS.PathOrFileDescriptor[]>;
export type Handler = (exception: (NodeJS.ErrnoException | null), files: FS.Dirent[]) => void;

export { Reader };

export default Reader;
