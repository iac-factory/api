import { Router } from "@iac-factory/api-routing";
import { Middleware } from "@iac-factory/api-middleware";
import { Application } from "@iac-factory/api-services";

import { Debugger } from "./debugger";

/*** @experimental */
const Logger = Debugger.hydrate({
    namespace: [ "Core", "blue" ],
    module: [ "Main", "gray" ],
    level: [ "Debug", "cyan" ],
    depth: [ 1, true ]
} );

Logger.debug("Starting Server");
async function Main (): Promise<void> {
    Logger.debug("Establishing Global Registry", "Reflection");

    await Middleware( Application );

    Application.use( "/", Router );

    void Application.listen( 3000, "0.0.0.0", 8192);
}

void (async () => Main())();

export * from "./debugger";
export * from "./generic";