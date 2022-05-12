#!/usr/bin/env node

require = require( "esm" )( module, { cjs: true, mode: "all", force: false } );

module.exports.default = require("./main");

const PKG = require("./main");

export * from "./src";

export default PKG.Application;

export { Application } from "./main";

export type { Server } from "./main";