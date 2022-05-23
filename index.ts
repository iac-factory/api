require = require( "esm" )( module, {} );

// Technically, the following line could result in a race-condition between
// the time of which "import()" is invoked & where "api-core" would initialize
// the API server from "process.env" settings

// Should a race-condition ever present itself, adjust the process start-up
// method := "node --require dotenv/config $(npm root)"

void ( async () => await import("./main") )();

module.exports = require( "@iac-factory/api-core" );
