import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import { Debugger } from "@iac-factory/api-core";

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "Body-Parser", "green" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

const HTTPs = (server: Application) => {
    console.debug( "[Middleware] [HTTPs] [Debug] Instantiating HTTPs Check" );
    const $ = (request: { headers: { host: string }; url: string }) => {
        return server.route( "https://" + request.headers.host + request.url );
    };

    console.debug( "[Middleware] [HTTPs] [Debug] Setting HTTPs Override" );

    server.use( $ );

    console.debug( "[Middleware] [HTTPs] [Debug] Enabled HTTPs Redirects" );
};

export { HTTPs };

export default HTTPs;
