#!/usr/bin/env node

module.require = require( "esm" )( module, "all" );

void (async () => (await import("./main")).Main())();
