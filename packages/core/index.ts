#!/usr/bin/env node

require = require( "esm" )( module, "all" );

void (async () => import("./src"))();

export {};
