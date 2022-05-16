import Event from "events";

import Application from "@iac-factory/api-services";

import { Router } from "@iac-factory/api-routing";

const Listen = (): Promise<void> => {
    return new Promise( (resolve) => Application
        .listen( 3000, "0.0.0.0", 8192, () => resolve )
    );
};

export const Main: () => Promise<void> = async () => {
    await Middleware( Application );

    Application.use( Router );

    // const myEE = new Event();
    // myEE.once( "initialization", () => console.log( "a" ) );
    // myEE.prependOnceListener( "initialization", () => console.log( "b" ) );

    // Server.once("initialization", myEE.emit);

    void await Listen();
};

import { Middleware } from "@iac-factory/api-middleware";

export default Main;
