import { Application } from "@iac-factory/api-services";
import { Router } from "@iac-factory/api-routing";

async function Main (): Promise<void> {
    const { Middleware } = await import("@iac-factory/api-middleware");
    await Middleware( Application );

    Application.use( "/", Router );

    void Application.listen( 3000, "0.0.0.0", 8192);
}

void (async () => Main())();