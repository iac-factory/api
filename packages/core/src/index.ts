import { Router } from "@iac-factory/api-routing";
import { Middleware } from "@iac-factory/api-middleware";
import { Application } from "@iac-factory/api-services";

async function Main (): Promise<void> {
    await Middleware( Application );

    Application.use( "/", Router );

    void Application.listen( 3000, "0.0.0.0", 8192);
}

void (async () => Main())();

export * from "./debugger";
export * from "./generic";