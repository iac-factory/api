#!/usr/bin/env node

require = require( "esm" )( module, { await: true, cjs: true, mode: "all" } );

module.exports = require( "./main" );

module.exports.default = require("./src");

export {};