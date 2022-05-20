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

module.exports = require( "./main" );

import { Framework } from "./main";
import { Application } from "./main";
import { Controller } from "./main";

import type { Reflection } from "./main";

export * from "./main";
export * from "./src";

export { Framework };
export { Application };
export { Controller };

export type { Reflection };

export default Application;
