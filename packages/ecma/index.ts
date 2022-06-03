import Module from "module";

import type Options from "esm";

const Import = Module.createRequire( __filename );

export module ESM {
    export type Runtime = typeof require & typeof Options;
    export const ECMA = Import( "esm" ) as Runtime;

    /***
     * Common-JS Settings for ESM Runtime(s)
     * @type {{cache: boolean, extensions: boolean, topLevelReturn: boolean, dedefault: boolean, mutableNamespace: boolean, paths: boolean, esModule: boolean, vars: boolean, namedExports: boolean}}
     * @private
     */
    const CJS: { cache: boolean; extensions: boolean; topLevelReturn: boolean; dedefault: boolean; mutableNamespace: boolean; paths: boolean; esModule: boolean; vars: boolean; namedExports: boolean; } = {
        cache: false,
        esModule: true,
        extensions: true,
        mutableNamespace: true,
        namedExports: true,
        paths: true,
        vars: true,
        dedefault: false,
        topLevelReturn: true
    };

    /***
     * Runtime ESM Configuration - Decoupled from Common-JS Settings
     * @type {{mode: string, cache: boolean, sourceMap: boolean, await: boolean, force: boolean}}
     * @private
     */
    const Runtime: { mode: string; cache: boolean; sourceMap: boolean; await: boolean; force: boolean; } = {
        mode: "auto",
        force: true,
        await: true,
        cache: false,
        sourceMap: true
    };

    /***
     * ESM Settings
     * ---
     * @type {{mode: string, cache: boolean, sourceMap: boolean, await: boolean, force: boolean, cjs: {cache: boolean, extensions: boolean, topLevelReturn: boolean, dedefault: boolean, mutableNamespace: boolean, paths: boolean, esModule: boolean, vars: boolean, namedExports: boolean}}}
     * @public
     */
    export const Configuration: { mode: string; cache: boolean; sourceMap: boolean; await: boolean; force: boolean; cjs: { cache: boolean; extensions: boolean; topLevelReturn: boolean; dedefault: boolean; mutableNamespace: boolean; paths: boolean; esModule: boolean; vars: boolean; namedExports: boolean; }; } = {
        ... { cjs: CJS }, ... Runtime
    };

    require = module.require = ECMA( module, {} );
}

export default ESM;
