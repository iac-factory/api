#!/usr/bin/env node

require = require( "esm" )( module, { cache: false } );

module.exports = require( "./main" );

(async () => await import("./src/client"))();

export {};