interface CJS {
    /*** A boolean for storing ES modules in require.cache. */
    cache: true;

    /*** A boolean for __esModule interoperability. */
    esModule: true;

    /*** A boolean for respecting require.extensions in ESM. */
    extensions: true;

    /*** A boolean for mutable namespace objects. */
    mutableNamespace: true;

    /*** A boolean for importing named exports of CJS modules. */
    namedExports: true;

    /*** A boolean for following CJS path rules in ESM. */
    paths: true;

    /*** A boolean for __dirname, __filename, and require in ESM. */
    vars: true;

    /*** A boolean for requiring ES modules without the dangling require().default. */
    dedefault: false;

    /*** A boolean for top-level return support. */
    topLevelReturn: false;
}

interface ESM {
    /*** An array of fields checked when importing a package */
    "mainFields": [ "main" ];

    /***
     * A string mode:
     * - "auto" detect files with import, import.meta, export, "use module", or .mjs as ESM.
     * - "all" files besides those with "use script" or .cjs are treated as ESM.
     * - "strict" to treat only .mjs files as ESM.
     */
    mode: "auto" | "all" | "strict";

    /*** A boolean for top-level await in modules without ESM exports (Node 10+) */
    await: false;
    /*** A boolean to apply these options to all module loads */
    force: false;
    /*** A boolean for WebAssembly module support (Node 8+) */
    wasm: false;

    cjs: CJS;
}
