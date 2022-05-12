import type FS from "fs";
import type Path from "path";

/***
 * Mode Enumeration
 * ---
 *
 * ```
 * enum Mode {
 *     object = "object",
 *     default = "default"
 * }
 * ```
 *
 * @example
 * /// Example Usage
 * Mode.object // >>> "object"
 *
 * @example
 * /// Default Assignment
 * Mode.default // >>> "default"
 */
enum Mode {
    object = "object",
    default = "default"
}

declare module Handler {
    /***
     * The `Existence` function's throwable Type
     * ---
     * Expected usage expects a file descriptor (file-system path) as input,
     * and an optional `raise` argument (defaults assignment to `false`).
     *
     * The default value of `false` for `raise` will ensure the callback
     * resolves a `boolean` := `true` | `false`.
     */
    type Content = string;

    /***
     * The `Existence` *Return* Type
     * ---
     *
     * See {@link Handler.Type} for additional details
     */
    type Return = () => Content;

    /***
     * The File System Path, Type-Castable to a {@link String}
     */
    type Descriptor = string | FS.PathOrFileDescriptor | Path.PlatformPath & String

    /***
     * The Runtime Mode
     * ---
     *
     * Can either interface an Enumeration callable,
     * or pass in an alike string:
     * - `"object"`
     * - `"mode"`
     *
     * See {@link Handler.Mode} for the Enumeration type
     */

    type Modes = keyof typeof Mode & string;

    export type { Content, Descriptor, Modes, Return };
}

export { Mode };

export default Handler;

export type { Handler };