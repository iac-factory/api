import { Router } from "@iac-factory/api-routing";
import { Middleware } from "@iac-factory/api-middleware";
import { Application } from "@iac-factory/api-services";

import { Debugger } from "./debugger";

/*** @experimental */
const Logger = Debugger.hydrate( {
    module: [ "Global", "blue" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

Logger.debug( "Starting Server ..." );

async function Main(): Promise<void> {
    Logger.debug( "Establishing Global Registry" );

    await Middleware( Application );

    Application.use( "/", Router );

    /*** Inline Type `settings` for HTTP-Listen Event Listener */
    const settings: [ number, string, number, () => void ] = [
        parseInt( process.env[ "SERVER_PORT" ]! ),
        process.env[ "SERVER_HOSTNAME" ]!,
        parseInt( process.env[ "SERVER_BACKLOG" ]! ),
        () => Logger.debug( "Server is Online" + ":" + " " + [
            "http://" + process.env[ "SERVER_HOSTNAME" ]!, process.env[ "SERVER_PORT" ]!
        ].join( ":" ) )
    ];

    void Application.listen( ... settings );
}

void ( async () => Main() )();

export * from "./debugger";
export * from "./generic";
