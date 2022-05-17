import Application from "@iac-factory/api-services";

import { Router } from "@iac-factory/api-routing";

export const Main: () => Promise<void> = async () => {
    await Middleware( Application );

    Application.use( "/", Router );

    void Application.listen( 3000, "0.0.0.0", 8192);
};

void (async () => Main())();

import { Middleware } from "@iac-factory/api-middleware";
