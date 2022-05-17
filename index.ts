#!/usr/bin/env node

require = require( "esm" )( module, { mode: "all" } );

module.exports = require( "@iac-factory/api-core" );

export {};