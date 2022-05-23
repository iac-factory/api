const CJS = {
    cache: false,
    esModule: true,
    extensions: true,
    mutableNamespace: true,
    namedExports: true,
    paths: true,
    vars: true,
    dedefault: false,
    topLevelReturn: true
}

require = require( "esm" )( module, { cjs: CJS, mode: "auto", force: true, await: true, cache: false, sourceMap: true } );

module.exports = require( "./src" );

void (async () => import("./src"))();

export * from "./src";