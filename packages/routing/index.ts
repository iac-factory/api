#!/usr/bin/env node

require = require( "esm" )( module, "all" );

module.exports = require( "./main" );

export * from "./main";

export { Router } from "./src";

export { Router as default } from "./src";
