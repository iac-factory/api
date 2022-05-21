import { HTTP } from "@iac-factory/api-schema";

import Application = HTTP.Application;

import Request = HTTP.Request;
import Response = HTTP.Response;
import Callback = HTTP.Next;

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
