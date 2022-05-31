import FS from "fs";
import Path from "path";
import URI from "url";
import Process from "process";

interface Locality {
    /*** Resolvable URL via Protocol */
    url: string;

    /*** Resolvable, Full System Path URI via Pathing */
    uri: string;

    /*** URI Absolute Check */
    absolute: boolean;
    /*** File-Type Check */
    file: boolean;

    /*** System File-Separator */
    delimiter: string;

    /*** Target File-Name, Normalized */
    name?: string | FS.PathLike;
    /*** Full System, Extension-Stripped Path */
    module?: string | FS.PathLike;
    /*** Target File Extension */
    extension?: string | FS.PathLike;

    /*** Full System Path to Directory */
    directory?: string | FS.PathLike;
    /*** Directory Name, Normalized */
    basename?: string | FS.PathLike;

    /*** Relative Path from Process.cwd() to Target */
    relative?: string | FS.PathLike;
}

/***
 * Module Class Package Resolver
 * ---
 *
 * A meta-type for individual modules to provide filesystem
 * metadata, primarily for the purpose of exporting to consumers.
 *
 * Includes convenience methods including dirname and filename
 * that's essentially a wrapper around CommonJS `__filename`
 * && `__dirname`.
 *
 * The last convenience method is `contents()` -- a callable that
 * returns the full content of the module's source code; usage
 * of `contents()` should be limited to CDKTF stack files, so
 * the contents can be written out to target distributions for
 * runtime usage.
 *
 * @example
 *
 * const Module = new Locality(import.meta.url);
 *
 * @example
 *
 * const Module = Locality.initialize(import.meta.url);
 *
 */

class Locality implements Locality {
    constructor(importable: string) {
        this.url = importable;
        this.uri = URI.fileURLToPath(this.url);

        this.absolute = Path.isAbsolute(this.uri) ?? false;
        this.file = FS.lstatSync(this.uri)?.isFile() ?? false;

        this.delimiter = Path.delimiter;

        this.extension = Path.extname( this.uri );

        this.name = Path.basename(this.uri, this.extension);
        this.module = Path.resolve(this.name);

        this.directory = Path.dirname(this.module);
        this.basename = Path.basename(this.directory);

        this.relative = Path.relative(Process.cwd(), this.uri);
    }

    static initialize(self: string): Locality {
        return Reflect.construct(Locality, [self]);
    }

    /*** Compatability Dot-Property, `__filename` */

    /***
     * Filename, Full System Path
     * ---
     *
     * @type {string | PathLike}
     *
     * @returns {string | PathLike}
     *
     */

    filename (): string {
        return this.uri;
    }

    /*** Compatability Dot-Property, `__dirname` */

    /***
     * Directory, Full System Path
     * ---
     *
     * @type {string | PathLike}
     *
     * @returns {string | PathLike}
     *
     */

    dirname () {
        return this.directory;
    }

    /***
     * Target File Contents
     * ---
     *
     * Encoded via UTF-8
     *
     * @returns {string | null}
     *
     */

    contents(): string | null {
        return (this.file) ? FS.readFileSync(this.uri).toString("utf-8").trim() : null;
    }
}

export { Locality };

export default Locality;