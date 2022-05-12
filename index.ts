#!/usr/bin/env node

require("regenerator-runtime/runtime");

require = require( "esm" )( module, { cjs: true } );

module.exports = require( "@iac-factory/api-core" );