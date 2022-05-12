#!/usr/bin/env node

require = require( "esm" )( module, "all" );

module.exports = require( "./main" );

module.exports.default = require( "./main" );

export { Middleware } from "./main";